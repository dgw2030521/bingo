import React from 'react';
import { Space } from 'antd-mobile';
import { map } from 'lodash-es';

export default function MyLink(props: any) {
  const { schema } = props;
  return (
    <Space direction={schema.direction}>
      {map(schema.links, (item, idx) => {
        return (
          <a
            key={idx}
            href={item.link_url}
            target={item.link_target ? '_blank' : ''}
            rel="noreferrer"
          >
            {item.link_title}
          </a>
        );
      })}
    </Space>
  );
}
