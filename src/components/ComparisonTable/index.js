import React from 'react';
import styles from './styles.module.css';

/**
 * 比较表格组件
 * 
 * 用法示例:
 * <ComparisonTable
 *   headers={['特性', 'TCP', 'UDP']}
 *   rows={[
 *     ['连接', '面向连接', '无连接'],
 *     ['可靠性', '可靠', '不可靠'],
 *     ['传输速度', '相对较慢', '快速']
 *   ]}
 * />
 */
export default function ComparisonTable({ headers, rows, caption }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.comparisonTable}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 