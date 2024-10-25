import { InfiniteScroll, Input } from 'antd-mobile';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoginContext } from '@/store/user';
import useHome from '@/views/home/useHome';

import styles from './index.module.scss';

export default function Home() {
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { isLogin } = useLoginContext();

  const { currentPage, getHomePolicyStat } = useHome();
  const handleSearchBtnClick = () => {
    const keywords = searchInputRef.current.nativeElement.value;
    navigate(`/policyList?keywords=${keywords}`, {
      state: { keywords },
    });
  };

  const handleLoadMore = async (pageNo: number) => {};

  useEffect(() => {
    getHomePolicyStat();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.logoTitle} />
      <div className={styles.searchBox}>
        <span className={styles.fangdajing} />
        <Input
          className={styles.searchInput}
          ref={el => {
            searchInputRef.current = el;
          }}
          onEnterPress={handleSearchBtnClick}
          placeholder="请输入政策关键字"
        />
        <span
          className={styles.searchBtn}
          onClick={() => {
            handleSearchBtnClick();
          }}
        >
          搜索
        </span>
      </div>
      <div className={styles.shortcuts}>
        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/policyList');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.shenbaodating]: true,
            })}
          />
          <span className={styles.title}>申报大厅</span>
        </div>
        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/policyFileList');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.huiqizhengce]: true,
            })}
          />
          <span className={styles.title}>惠企政策</span>
        </div>
        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/recommendation');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.zhinengtuijian]: true,
            })}
          />
          <span className={styles.title}>智能推荐</span>
        </div>
        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/policyList/no-apply');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.mianshenjixiang]: true,
            })}
          />
          <span className={styles.title}>免申即享</span>
        </div>

        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/policyList/business');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.getigongshang]: true,
            })}
          />
          <span className={styles.title}>个体工商</span>
        </div>

        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/suggest');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.suqiujianyi]: true,
            })}
          />
          <span className={styles.title}>诉求建议</span>
        </div>

        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/declare');
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.wodeshenbao]: true,
            })}
          />
          <span className={styles.title}>我的申报</span>
        </div>

        <div
          className={styles.cardItem}
          onClick={() => {
            navigate('/enterprise'); // 借个跳转
          }}
        >
          <div
            className={classNames({
              [styles.icon]: true,
              [styles.wodeyuyue]: true,
            })}
          />
          <span className={styles.title}>我的企业</span>
        </div>
      </div>
      <div className={styles.simpleInfo}>
        <div
          className={classNames({
            [styles.leijishixiang]: true,
            [styles.sCard]: true,
          })}
        >
          <div className={styles.title}>累计政策事项数</div>
          <div className={styles.memo}>
            <span className={styles.content}>1122</span>
            <span className={styles.unit}>项</span>
          </div>
        </div>
        <div
          className={classNames({
            [styles.zhengzaiduifu]: true,
            [styles.sCard]: true,
          })}
        >
          <div className={styles.title}>正在兑付事项数</div>
          <div className={styles.memo}>
            <span className={styles.content}>3444</span>
            <span className={styles.unit}>项</span>
          </div>
        </div>
      </div>
      <div className={styles.policyList}>
        <div className={styles.header}>申报通知</div>
        <div
          className={styles.card}
          onClick={() => {
            navigate(`/policyFileDetail/1`);
          }}
        >
          <div
            className={classNames({
              [styles.left]: true,
              [styles.level1]: true,
            })}
          >
            <span className={styles.areaName}>1122</span>
          </div>
          <div className={styles.right}>
            <div className={styles.head}>123</div>
            <div className={styles.tag}>
              <span className={styles.item}>111</span>
              <span className={styles.item}>222</span>
            </div>
            <div className={styles.memo}>
              <span className={styles.pos}>{111}</span>
              <span className={styles.date}>{222}</span>
            </div>
          </div>
        </div>
        <InfiniteScroll
          loadMore={() => {
            return handleLoadMore(currentPage);
          }}
          hasMore={false}
        />
      </div>
    </div>
  );
}
