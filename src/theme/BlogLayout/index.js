/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

export default function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  
  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          {/* 修改左侧边栏宽度 col--3 保持不变 */}
          <BlogSidebar sidebar={sidebar} />
          
          {/* 修改中间内容区域宽度从 col--7 改为 col--6 */}
          <main
            className={clsx('col', {
              'col--6': hasSidebar,
              'col--12 ': !hasSidebar,
            })}>
            {children}
          </main>
          
          {/* 修改右侧目录宽度从 col--2 改为 col--3 */}
          {toc && <div className="col col--3">{toc}</div>}
        </div>
      </div>
    </Layout>
  );
} 