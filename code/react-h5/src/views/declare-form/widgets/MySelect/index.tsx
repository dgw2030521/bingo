import { CheckList, Popup, SearchBar, Space } from 'antd-mobile';
import { find, isEmpty, map, omit } from 'lodash-es';
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './index.module.scss';

export default function MySelect(props: any) {
  const {
    value,
    onChange,
    placeholder = '请选择',
    options,
    readOnly,
  } = omit(props, ['addons', 'schema']);

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(value);

  const [searchText, setSearchText] = useState('');
  const selectRef: any = useRef(null);
  selectRef.current = selectRef.current || {};

  // 使用useImperativeHandle暴露方法给外部
  // 借助了对picker的支持，默认click调用open方法
  // x-render/packages/form-render-mobile/src/render-core/FieldItem/main.tsx
  useImperativeHandle(props.addons.fieldRef, () => ({
    open: () => {
      setVisible(true);
    },
  }));

  const showLabels = (selectedValues: (string | number)[]) => {
    const labels = map(selectedValues, selectedValue => {
      const matchedEnum = find(options, item => {
        return item.value === selectedValue;
      });
      return matchedEnum;
    });
    return map(labels, item => {
      return (
        <span className={styles.tag} key={item.value}>
          {item.label}
        </span>
      );
    });
  };

  const filteredItems = useMemo(() => {
    if (searchText) {
      return options.filter(item => item.label.includes(searchText));
    }
    return options;
  }, [options, searchText]);

  useEffect(() => {
    return () => {
      selectRef.current = null;
    };
  }, []);

  // if (readOnly) {
  //   // 只读组件待实现
  //   // return  showLabels(value)
  // }

  return (
    <>
      <div className={styles.contentBox}>
        {!isEmpty(selected) ? (
          showLabels(selected)
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </div>
      <Popup
        destroyOnClose
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        onClose={() => {
          setVisible(false);
        }}
        closeOnMaskClick
        visible={visible}
      >
        <div className={styles.searchBarContainer}>
          <Space
            align="center"
            justify="between"
            block
            className={styles.operateBox}
          >
            <span
              className={styles.operateBtn}
              onClick={() => {
                setVisible(false);
              }}
            >
              取消
            </span>
            <span
              className={styles.operateBtn}
              onClick={() => {
                setVisible(false);
                setSelected(selectRef.current.selected);
                onChange(selectRef.current.selected);
              }}
            >
              确认
            </span>
          </Space>
          <SearchBar
            className={styles.searchInput}
            placeholder="输入文字过滤选项"
            value={searchText}
            onChange={v => {
              setSearchText(v);
            }}
          />
        </div>
        <div className={styles.checkListContainer}>
          <CheckList
            multiple
            className={styles.myCheckList}
            defaultValue={selected}
            onChange={val => {
              selectRef.current.selected = val;
            }}
          >
            {map(filteredItems, item => {
              return (
                <CheckList.Item key={item.value} value={item.value}>
                  {item.label}
                </CheckList.Item>
              );
            })}
          </CheckList>
        </div>
      </Popup>
    </>
  );
}
