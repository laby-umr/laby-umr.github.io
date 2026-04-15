import React from 'react';
import styles from './styles.module.css';

export default function ComparisonTable({ data }) {
  if (!data || !data.headers || !data.rows) {
    return <div className={styles.error}>ComparisonTable: Invalid data format</div>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.comparisonTable}>
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index} className={styles.tableHeader}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.tableCell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
