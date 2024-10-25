import classNames from 'classnames';
import React from 'react';

import styles from '@/views/match-policy/index.module.scss';

interface MatchNumberProps {
  count: string;
  title?: string;
}
export default function MatchNumber(props: MatchNumberProps) {
  const { title } = props;
  const count = Number.parseFloat(props.count || '0');
  return (
    <>
      {title && <div className={styles.showMatchResultTitle}>{title}</div>}
      <div
        className={classNames({
          [styles.showMatchResult]: true,
          [styles.blue]: count > 40 && count < 70,
          [styles.green]: count >= 70 && count <= 100,
          [styles.red]: count <= 40,
        })}
      >
        <span className={styles.icon} />
        {count}
        <span className={styles.unit}>%</span>
      </div>
    </>
  );
}
