import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef, useState, useCallback } from 'react';

import './CircularGallery.css';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 60;
  canvas.height = textHeight + 40;
  
  // 清除画布
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // 设置字体和样式
  context.font = font;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  
  // 添加阴影效果
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 10;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  
  // 绘制文字
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    // 文字浮在图片上方，z轴向前移动，y轴移到底部
    this.mesh.position.y = -this.plane.scale.y * 0.35;
    this.mesh.position.z = 0.5;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    link,
    description,
    onClick
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.link = link;
    this.description = description;
    this.onClick = onClick;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uTime;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 CenterPosition, vec2 Size, float Radius) {
          return length(max(abs(CenterPosition) - Size + Radius, 0.0)) - Radius;
        }
        
        vec2 getCoverUvs(vec2 imageSize, vec2 planeSize) {
          vec2 ratio = vec2(
            min((planeSize.x / planeSize.y) / (imageSize.x / imageSize.y), 1.0),
            min((planeSize.y / planeSize.x) / (imageSize.y / imageSize.x), 1.0)
          );
          return vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
        }
        
        // 电光边框效果
        float electricBorder(vec2 uv, float time) {
          float border = 0.015; // 边框宽度
          vec2 center = uv - 0.5;
          float dist = roundedBoxSDF(center, vec2(0.5 - uBorderRadius), uBorderRadius);
          float borderDist = abs(dist);
          
          // 创建流动的电光效果
          float angle = atan(center.y, center.x);
          float perimeter = (angle / 3.14159) * 0.5 + 0.5;
          float wave = sin(perimeter * 20.0 - time * 2.0) * 0.5 + 0.5;
          float pulse = sin(time * 3.0) * 0.3 + 0.7;
          
          // 边框强度
          float borderStrength = smoothstep(border + 0.005, border, borderDist);
          borderStrength *= wave * pulse;
          
          return borderStrength;
        }
        
        void main() {
          vec2 uv = getCoverUvs(uImageSizes, uPlaneSizes);
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          if (d > 0.0) {
            discard;
          }
          
          // 添加电光边框
          float borderGlow = electricBorder(vUv, uTime);
          vec3 electricColor = vec3(0.49, 0.98, 1.0); // 青色 #7df9ff
          color.rgb += electricColor * borderGlow * 0.8;
          
          gl_FragColor = color;
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      onClick
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onClick = onClick;
    this.destroyed = false;
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font, onClick);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font, onClick) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: 'Palm Trees' }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        link: data.link,
        description: data.description,
        onClick: onClick
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp(e) {
    if (!this.isDown) return;
    
    // 安全地获取客户端坐标
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null);
    const moved = this.start && clientX !== null && Math.abs(clientX - this.start) > 5;
    this.isDown = false;
    
    // 只有在画布内点击才触发
    if (!moved && this.medias && this.medias.length > 0 && e.target === this.gl.canvas) {
      // 找到最靠近中心的卡片，且距离必须足够近
      let closestMedia = null;
      let minDistance = Infinity;
      
      this.medias.forEach((media) => {
        if (!media || !media.plane) return;
        const distance = Math.abs(media.plane.position.x);
        if (distance < minDistance) {
          minDistance = distance;
          closestMedia = media;
        }
      });
      
      // 只有当卡片足够靠近中心时才触发（距离小于卡片宽度的30%）
      if (closestMedia && closestMedia.onClick && minDistance < closestMedia.width * 0.3) {
        // 传递完整的 item 数据
        const itemData = {
          image: closestMedia.image,
          text: closestMedia.text,
          link: closestMedia.link,
          description: closestMedia.description
        };
        setTimeout(() => {
          closestMedia.onClick(itemData);
        }, 0);
      }
    }
    
    this.onCheck();
  }
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    // 检查是否已销毁
    if (this.destroyed || !this.renderer || !this.scene || !this.camera) {
      return;
    }
    
    // 自动滚动：持续向右滚动（降低速度）
    if (!this.isDown) {
      this.scroll.target += 0.08;
    }
    
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    if (this.scroll.current > this.scroll.last) {
      this.direction = 'right';
    } else {
      this.direction = 'left';
    }
    if (this.medias) {
      for (const media of this.medias) {
        media.update(this.scroll, this.direction);
      }
    }
    this.scroll.last = this.scroll.current;
    
    // 再次检查 renderer 是否存在
    if (this.renderer && !this.destroyed) {
      this.renderer.render({
        scene: this.scene,
        camera: this.camera
      });
    }
    
    if (!this.destroyed) {
      this.requestId = window.requestAnimationFrame(this.update.bind(this));
    }
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('mousewheel', this.boundOnWheel);
    window.addEventListener('wheel', this.boundOnWheel);
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown);
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);
  }
  destroy() {
    // 标记为已销毁
    this.destroyed = true;
    
    // 取消动画帧
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    
    // 移除所有事件监听器
    if (this.boundOnResize) window.removeEventListener('resize', this.boundOnResize);
    if (this.boundOnWheel) {
      window.removeEventListener('mousewheel', this.boundOnWheel);
      window.removeEventListener('wheel', this.boundOnWheel);
    }
    if (this.boundOnTouchDown) {
      window.removeEventListener('mousedown', this.boundOnTouchDown);
      window.removeEventListener('touchstart', this.boundOnTouchDown);
    }
    if (this.boundOnTouchMove) {
      window.removeEventListener('mousemove', this.boundOnTouchMove);
      window.removeEventListener('touchmove', this.boundOnTouchMove);
    }
    if (this.boundOnTouchUp) {
      window.removeEventListener('mouseup', this.boundOnTouchUp);
      window.removeEventListener('touchend', this.boundOnTouchUp);
    }
    
    // 清理 medias
    if (this.medias) {
      this.medias.forEach(media => {
        if (media.plane && media.plane.parent) {
          media.plane.setParent(null);
        }
        if (media.program && media.program.uniforms && media.program.uniforms.tMap && media.program.uniforms.tMap.value) {
          const texture = media.program.uniforms.tMap.value;
          if (texture.image) texture.image = null;
        }
      });
      this.medias = null;
    }
    
    // 清理 WebGL 资源
    if (this.renderer && this.renderer.gl) {
      const gl = this.renderer.gl;
      const canvas = gl.canvas;
      
      // 失去 WebGL 上下文
      const loseContextExt = gl.getExtension('WEBGL_lose_context');
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
      
      // 移除 canvas
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      
      this.renderer = null;
      this.gl = null;
    }
    
    // 清理其他引用
    this.scene = null;
    this.camera = null;
    this.planeGeometry = null;
    this.container = null;
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05,
  onClick
}) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [enlargedItem, setEnlargedItem] = useState(null);
  
  const handleItemClick = useCallback((item) => {
    setEnlargedItem(item);
  }, []);
  
  const handleClose = useCallback(() => {
    setEnlargedItem(null);
  }, []);
  
  const handleNavigate = useCallback(() => {
    if (enlargedItem && enlargedItem.link && onClick) {
      onClick(enlargedItem.link);
    }
  }, [enlargedItem, onClick]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      appRef.current = new App(containerRef.current, { 
        items, 
        bend, 
        textColor, 
        borderRadius, 
        font, 
        scrollSpeed, 
        scrollEase,
        onClick: handleItemClick
      });
    } catch (error) {
      console.error('CircularGallery initialization error:', error);
    }
    
    return () => {
      if (appRef.current) {
        try {
          appRef.current.destroy();
          appRef.current = null;
        } catch (error) {
          console.error('CircularGallery cleanup error:', error);
        }
      }
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, handleItemClick]);
  
  return (
    <>
      <div className="circular-gallery" ref={containerRef} />
      
      {enlargedItem && (
        <div 
          className={`circular-gallery-overlay ${enlargedItem ? 'active' : ''}`}
          onClick={handleClose}
        >
          <div 
            className="circular-gallery-card"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={enlargedItem.image} 
              alt={enlargedItem.text}
              className="circular-gallery-card-image"
            />
            <div className="circular-gallery-card-gradient" />
            <div className="circular-gallery-card-content">
              <h3 className="circular-gallery-card-title">{enlargedItem.text}</h3>
              {enlargedItem.description && (
                <p className="circular-gallery-card-description">{enlargedItem.description}</p>
              )}
            </div>
            {enlargedItem.link && (
              <div className="circular-gallery-card-button">
                <button 
                  className="circular-gallery-card-btn cursor-target"
                  onClick={handleNavigate}
                >
                  <span>查看详情</span>
                  <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
