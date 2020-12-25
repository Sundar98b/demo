import styled from "styled-components";
import React, { Fragment, useEffect, useState } from "react";
import { Select } from "antd";

import HttpService from "../../services/httpService";
import UserChip from "../user-chip";
import Utils from "../../utils";

const Divivder = styled.div`
  border-bottom: var(--light-bdr);
`;

const Option = Select.Option;
interface Options {
  name: string;
  value: string;
}
interface Select2 {
  entity?: string;
  options?: Options[];
  key?: string;
  value?: string | string[];
  entity_id?: string;
  entity_search?: string[];
  [x: string]: any;
  default?: Options;
}

const UserData = (props: any) => {
  return (
    <Fragment>
      <UserChip name={props.display_name} img={props.profile_photo} />
      {props.department_name && <Divivder>{props.department_name}</Divivder>}
    </Fragment>
  );
};

const Select2: React.FC<Select2> = props => {
  const Child = Fragment;

  const [EntityOptions, setEntityOptions] = useState([]);
  const [isPageLoaded, setisPageLoaded] = useState(false);

  const renderChild = (item: any) => {
    if (
      props.entity === "users" ||
      props.entity === "users/direct-reportees" ||
      props.entity === "users/secondary-reportees" ||
      props.entity?.includes("users/reporting-users/")
    ) {
      return UserData(item);
    } else {
      return <Child> {item[props.entity_id || ""]}</Child>;
    }
  };

  useEffect(() => {
    if (props.entity) {
      const input = Utils.serialize({ limit: 1000 }, "");
      HttpService.get(props.entity, input).then(res => {
        setisPageLoaded(true);

        if (props.default && props.default.value) {
          console.count("select2");
          let hasDefault = false;
          if (res.data?.length > 0) {
            hasDefault = true;
          }
          console.log(hasDefault, "check  res.data length is empty or not");
          let notFound = false;
          for (const item of res["data"]) {
            if (item.id !== props.default?.value) {
              notFound = false;
            } else if (item.id === props.default?.value) {
              console.log("found key in select2");
              console.log(props.default, "props.default");
              notFound = true;
              break;
            }
          }
          hasDefault = notFound;
          // res.data.forEach((item: any) => {

          // });

          if (!hasDefault) {
            console.log(props.default, "push default into res.data");
            console.count("push data");

            let entity_id = props.entity_id || "name";
            res.data.push({
              [entity_id]: props.default.name,
              id: props.default.value,
            });
          }
        }
        setEntityOptions(res.data);
      });
    }
  }, [props.default, props.entity, props.entity_id]);

  const doSearch = (q: string) => {
    const input = Utils.serialize(
      { limit: 100, search: props.entity_search, q: q },
      "",
    );

    HttpService.get(props.entity, input).then(res => {
      setisPageLoaded(true);
      setEntityOptions(res.data);
    });
  };

  return (
    <>
      <Select
        showSearch
        autoClearSearchValue
        onSearch={doSearch}
        filterOption={false}
        onChange={(e, options) => {
          if (props.onSelect) {
            props.onSelect(e, options);
          }
        }}
        loading={!!(props?.entity && !isPageLoaded)}
        {...props}
        defaultValue={props?.default?.value ?? ""}
      >
        {!props.entity && (
          <>
            {props.options?.map(item => (
              <Option key={item.value} value={item.name}>
                <Child>{item.value}</Child>
              </Option>
            ))}
          </>
        )}
        {EntityOptions?.map(item => (
          <Option key={item["id"]} value={item["id"]} item={item}>
            {renderChild(item)}
          </Option>
        ))}
      </Select>
    </>
  );
};

Select2.defaultProps = {
  entity_id: "name",
  entity_search: ["name"],
};
export default Select2;
