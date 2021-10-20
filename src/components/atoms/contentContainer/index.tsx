import React from 'react'
import styles from './contentContainer.module.scss';

export default function ContentContainer({ children }: any) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}