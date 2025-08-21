import React, { useEffect } from 'react';
import styles from './styles.module.css';

/**
 * 增强型表格组件，自动优化表格列宽和布局
 * 用于解决表格不填满容器宽度的问题
 * 
 * 此版本使用CSS类和React友好的方法，避免直接操作DOM
 */
function EnhancedTable() {
  useEffect(() => {
    // 安全地添加表格样式类
    const addTableStyles = () => {
      try {
        // 创建样式元素而不是直接操作DOM
        const styleElement = document.createElement('style');
        styleElement.id = 'enhanced-table-styles';
        
        // 如果已存在则不重复添加
        if (document.getElementById('enhanced-table-styles')) {
          return;
        }
        
        // 创建CSS内容，使用类选择器而不是直接操作DOM
        const cssContent = `
          /* 强制表格容器出现滚动条 */
          .table-container {
            width: 100%;
            overflow-x: auto !important;
            margin-bottom: 1.5rem;
            display: block !important;
            -webkit-overflow-scrolling: touch;
            position: relative;
            max-width: 100%;
          }
          
          /* 确保表格可以横向滚动 */
          .table-container table {
            width: 100%;
            min-width: 100%;
            border-collapse: collapse;
            table-layout: auto !important; /* 改为auto让表格根据内容调整宽度 */
          }
          
          /* 添加较小内边距减少被挤压 */
          .table-container table th,
          .table-container table td {
            padding: 0.75rem 1rem;
            border: 1px solid var(--ifm-table-border-color);
            white-space: normal !important; /* 允许文本换行 */
            word-break: normal !important; /* 防止文本断开 */
            min-width: 100px; /* 增加每列的最小宽度 */
            text-align: left; /* 确保文本左对齐 */
          }
          
          /* 针对特殊列的宽度优化 */
          .table-container table th:first-child,
          .table-container table td:first-child {
            min-width: 130px; /* 第一列通常包含重要标识，给予更多宽度 */
          }
          
          .table-container table th:last-child,
          .table-container table td:last-child {
            min-width: 150px; /* 最后一列也通常包含重要信息，确保有足够宽度 */
            white-space: normal !important; /* 特别确保最后一列的文字不会被压缩 */
          }
          
          /* 针对不同列数的表格设置最小宽度而非固定宽度 */
          table.has-2-columns { min-width: 400px; }
          table.has-3-columns { min-width: 600px; }
          table.has-4-columns { min-width: 800px; }
          table.has-5-columns { min-width: 1000px; }
          table.has-6-columns { min-width: 1200px; } /* 确保6列表格有足够宽度 */
          table.has-7-columns { min-width: 1400px; }
          
          /* 视觉提示，表示表格可以滚动 */
          .table-container::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 20px;
            background: linear-gradient(to right, rgba(0,0,0,0), rgba(var(--ifm-color-primary-rgb), 0.15));
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
          }
          
          .table-container.scrollable::after {
            opacity: 1;
          }
          
          /* 表格样式增强 */
          table thead tr {
            background-color: var(--ifm-table-head-background);
            position: sticky;
            top: 0;
            z-index: 1;
          }
          
          table tbody tr:nth-child(odd) {
            background-color: var(--ifm-table-stripe-background);
          }
          
          /* 防止单元格中的文本竖排显示 */
          table th, table td {
            writing-mode: horizontal-tb !important; /* 强制水平文本方向 */
            text-orientation: mixed !important; /* 确保文本正确方向 */
          }
          
          /* 针对星星评分单元格的优化 */
          table td:has(img), 
          table td:has(svg) {
            white-space: nowrap; /* 防止评分图标换行 */
            text-align: center; /* 评分居中 */
          }
        `;
        
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        // 使用定时器延迟执行表格类名添加，避免和React的渲染周期冲突
        setTimeout(() => {
          document.querySelectorAll('table').forEach(table => {
            if (!table.classList.contains('enhanced') && !table.closest('.theme-code-block')) {
              // 添加增强标记
              table.classList.add('enhanced');
              
              // 包装表格以提供滚动支持
              if (!table.parentElement.classList.contains('table-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-container';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
                
                // 检测表格是否需要滚动
                const checkScroll = () => {
                  if (table.offsetWidth > wrapper.offsetWidth) {
                    wrapper.classList.add('scrollable');
                  } else {
                    wrapper.classList.remove('scrollable');
                  }
                };
                
                // 初始检测
                checkScroll();
                
                // 监听窗口大小变化
                window.addEventListener('resize', checkScroll);
              }
              
              // 添加列数类名
              const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
              if (headerRow) {
                const columnCount = headerRow.children.length;
                table.classList.add(`has-${columnCount}-columns`);
              }
              
              // 特别处理竖排文本问题
              table.querySelectorAll('th, td').forEach(cell => {
                // 检查是否有竖排文本的单元格（文本高度远大于宽度的情况）
                if (cell.offsetHeight > cell.offsetWidth * 2) {
                  cell.style.writingMode = 'horizontal-tb';
                  cell.style.whiteSpace = 'normal';
                  cell.style.minWidth = '150px'; // 给予这类单元格更多宽度
                }
              });
            }
          });
        }, 500); // 延迟500ms以确保React DOM已完成渲染
      } catch (error) {
        console.error('EnhancedTable error:', error);
      }
    };

    // 初始执行
    addTableStyles();
    
    // 避免使用MutationObserver，改用定期检查
    const intervalId = setInterval(addTableStyles, 2000);
    
    // 清理函数
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // 不渲染任何实际元素
  return null;
}

export default EnhancedTable; 