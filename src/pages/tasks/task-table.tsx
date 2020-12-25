import styled from "styled-components";
import useMedia from "use-media";
import React, { ReactNode, memo, useEffect, useState } from "react";
import { Button, Input, Pagination, Result } from "antd";
import { DownCircleTwoTone, UpCircleTwoTone } from "@ant-design/icons";
import { v4 } from "uuid";

import HttpService from "../../services/httpService";
import Utils from "../../utils";
import useResizeObserver from "../../hooks/useResizeObserver";
import { SortAlphAsc } from "../../components/icons";

const { xs } = Utils.MediaQuery;

export type Columns = {
  name: string;
  sortable?: boolean;
  render?: Function;
  key?: string;
  dataType?: string;
  width?: string;
};
interface TableComponentProps {
  columns: Columns[];
  data?: any[];
  primary?: string;
  edit?: Function;
  delete?: Function;
  loaders?: Number;
  pagination?: Boolean;
  searchable?: Boolean;
  entity?: string;
  searchArray?: Array<String>;
  refreshPage?: number;
  onRender?: Function;
  footer?: ReactNode;
  status?: string;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #eee;
  font-size: 12px;
  background: #fff;
  color: var(--table-color);
  border-bottom: none;
  table-layout: fixed;

  tfoot {
    th {
      padding: 12px;
      background: #f8f9fa;
    }
  }

  .sort-icons {
    font-size: 12px;
    float: right;
    color: var(--table-color);
    margin-top: 3px;
    visibility: hidden;
  }

  .xs-primary-close {
    display: contents;
    ${xs} {
      height: 0;
      overflow: hidden;
      display: block;
    }
  }

  .xs-primary-open {
    animation-name: slideDown;
    overflow: hidden;
    animation-duration: 2s;
    animation-timing-function: ease-in;
  }

  ${xs} {
    width: 99%;
    margin-left: 0;
  }
  .md-primary {
    display: contents;
  }
  .xs-primary {
    display: block;
    height: 0;
    overflow: hidden;
  }
`;

const TR = styled.tr`
  border-bottom: 1px solid #f3f3f3;
  ${xs} {
    display: block;
  }
  &:hover {
    background: #f0faff;
    ${xs} {
      background: #fff;
    }
  }

  .xs-row {
    display: none;
    ${xs} {
      display: block;
    }
  }
`;

const Thead = styled.thead`
  ${xs} {
    display: none;
  }
`;

const TH = styled.th`
  cursor: ${props => (props.sortable ? "pointer" : "text")};
  padding: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;

  border-bottom: 1px solid #f0f0f0;
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;

  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  /* max-width: ${props => (props.width ? props.width : "300px")}; */
  &:hover {
    .sort-icons {
      visibility: visible;
    }
  }
`;

const Tbody = styled.tbody``;

const TD = styled.td`
  padding: 12px;
  background: ${props =>
    !props.isActive ? "initial" : "rgba(250, 250, 250,1)"};
  -webkit-transition: background 0.3s ease;
  transition: background 0.3s ease;

  width: ${props => (props.width ? props.width : "300px")};
  max-width: 400px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.primary-row .anticon {
    position: relative;
    left: -120%;
  }
  ${xs} {
    display: block;
    border: none;
    border-bottom: 1px solid rgba(231, 231, 231, 0.184);
    position: relative;
    padding-left: 50%;
    text-align: left;
    &::before {
      content: attr(data-label);
      display: inline-block;
      line-height: 1.5;
      margin-left: -100%;
      width: 100%;
      white-space: nowrap;
    }
  }
`;

const SearchDiv = styled.div`
  float: right;
  width: 250px;
  margin-bottom: 10px;
  position: absolute;
  right: 57px;
  top: 8px;
`;

const TaskTable: React.FC<TableComponentProps> = props => {
  const [sortOrder, setSortOrder] = useState(["created_on", "DESC"]);
  const [windowSize, setWindowSize] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeChange, setPageSizeChanger] = useState(10);
  const [loaders, setLoaders] = useState(0);
  const [searchValue, setSearch] = useState("");
  const [IsError, setIsError] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (props.status) {
      if (props.status === "Total") {
        setStatus("");
      } else {
        setStatus(props.status);
      }
    } else {
      setStatus("");
    }
  }, [props.status]);

  useEffect(() => {
    if (props.entity !== undefined) {
      getData();
    } else {
      setLoaders(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortOrder,
    currentPage,
    pageSizeChange,
    searchValue,
    props.refreshPage,
    props.entity,
    status,
  ]);

  //@ts-ignore
  const serialize = (obj: any, prefix: any) => {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push(
          v !== null && typeof v === "object"
            ? serialize(v, k)
            : encodeURIComponent(k) + "=" + encodeURIComponent(v),
        );
      }
    }
    return str.join("&");
  };

  const getData = () => {
    //@ts-ignore
    setLoaders(parseInt((pageSize, 10)));
    const query = serialize(
      {
        limit: pageSizeChange,
        page: currentPage,
        status: status,
        sort: {
          column: sortOrder[0],
          order: sortOrder[1],
        },
        q: searchValue,
        search: searchArray,
      },
      "",
    );
    HttpService.get(props.entity, query)
      .then((res: any) => {
        if (Object.keys(res).length === 0) {
          setDataSoure([]);
        } else if (res) {
          setDataSoure(res.data);
          setPageSize(res.meta.limit);
          setTotalPage(res.meta.total);
          if (props.onRender) {
            props.onRender(res);
          }
        }
        setIsError(false);
      })
      .catch(err => {
        console.warn(err);
        setIsError(true);
      })
      .finally(() => {
        setLoaders(0);
      });
  };

  useResizeObserver(() => {
    setWindowSize(window.innerHeight);
  });

  const isMobile = useMedia("(max-width: 767px)") ? true : false;

  const { columns, primary, data, searchable, pagination, searchArray } = props;
  // const setInitialData = (data: any[]) => {
  //   const _data = data.map(item => {
  //     item.__is_collapsable = false;
  //     return item;
  //   });
  //   setDataSoure(_data);
  // };

  // useEffect(() => {
  //   setInitialData(data);
  // }, [data]);
  const [dataSource, setDataSoure] = useState(data);

  useEffect(() => {
    setDataSoure(dataSource);
  }, [windowSize, isMobile, data, dataSource]);

  const sortBy = (Columns: Columns) => {
    if (!Columns.sortable) {
      return false;
    }
    const order = sortOrder[1];
    const key: string = Columns.key || "";
    setSortOrder([key, order === "ASC" ? "DESC" : "ASC"]);
  };

  let primaryColIndex = 0;

  const getPrimaryName = () => {
    const colLen = columns.length;
    for (let index = 0; index < colLen; index++) {
      if (primary === columns[index].key) {
        primaryColIndex = index;
        return columns[index].name;
      }
    }
  };

  const getLoader = (count: number) => {
    let tds = [];
    for (var i = count - 1; i >= 0; i--) {
      tds.push(
        <TD key={i + v4()}>
          <div className="skleton"></div>
        </TD>,
      );
    }
    return tds;
  };

  const getTD = (tr: any) => {
    const tds: any = [];
    columns.map((td: Columns) => {
      if ((isMobile && td.key !== primary) || !isMobile) {
        tds.push(
          <TD
            key={td.name + "--td"}
            data-label={td.name}
            isActive={td.key === sortOrder[0]}
            width={td.width}
          >
            {td.render && td.render(tr)}
            {!td.render && td.key && tr[td.key]}
          </TD>,
        );
      }
      return null;
    });

    return <>{tds}</>;
  };

  const toggleXSRow = (index: number) => {
    // if (data) {
    //   const newData = [...data];
    //   newData[index].__is_collapsable = !newData[index].__is_collapsable;
    //   setDataSoure(newData);
    // }
  };

  const searchTable = (e: any) => {
    setSearch(e);
  };

  const pageChange = (page: number) => {
    setCurrentPage(page);
    setPageSizeChanger(pageSizeChange);
  };

  const onShowSizeChange = (current: number, pageSize: number) => {
    setPageSizeChanger(pageSize);
    setCurrentPage(current);
  };

  const Reload = () => {
    window.location.reload();
  };

  return (
    <div>
      {searchable && (
        <SearchDiv className="search-wrapper">
          <Input.Search placeholder="Search" onSearch={e => searchTable(e)} />
        </SearchDiv>
      )}
      <Table>
        <Thead>
          <TR>
            {props.columns.map(th => (
              <TH
                key={th.name}
                onClick={() => sortBy(th)}
                sortable={th.sortable}
                width={th.width}
              >
                {th.sortable && <SortAlphAsc className="sort-icons" />}
                {th.name}
              </TH>
            ))}
          </TR>
        </Thead>
        <Tbody>
          <>
            {IsError && (
              <tr>
                <td colSpan={props.columns.length}>
                  <Result
                    status="500"
                    title="500"
                    subTitle="Sorry, something went wrong"
                    extra={
                      <Button onClick={Reload} type="primary">
                        Reload Page
                      </Button>
                    }
                  />
                </td>
              </tr>
            )}

            {!IsError && (
              <>
                {[...Array(loaders)].map((x, i) => (
                  <TR key={v4()}>{getLoader(props.columns.length)}</TR>
                ))}

                {!loaders &&
                  dataSource &&
                  dataSource.map((tr, index) => {
                    const isRender =
                      typeof columns[primaryColIndex].render === "function";
                    return (
                      <TR key={index}>
                        <>
                          {isMobile && (
                            <TD
                              data-label={getPrimaryName()}
                              className="primary-row"
                              onClick={() => toggleXSRow(index)}
                            >
                              {tr.__is_collapsable ? (
                                <UpCircleTwoTone style={{ fontSize: 16 }} />
                              ) : (
                                <DownCircleTwoTone style={{ fontSize: 16 }} />
                              )}
                              {/* 
                          {/* 
                            {/* prettier-ignore */}
                              {/* 
                        // @ts-ignore */}
                              {isRender && columns[primaryColIndex].render(tr)}
                              {!columns[primaryColIndex].render &&
                                primary &&
                                tr[primary]}
                            </TD>
                          )}
                          {/* <div
                        className={
                          tr.__is_collapsable
                            ? "xs-primary-open"
                            : "xs-primary-close"
                        }
                      > */}
                          {getTD(tr)}
                          {/* </div> */}
                        </>
                      </TR>
                    );
                  })}
              </>
            )}
          </>
        </Tbody>
        {props.footer && <tfoot>{props.footer}</tfoot>}
      </Table>
      <div style={{ marginTop: "10px", float: "right" }}>
        {pagination && (
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            current={currentPage}
            pageSize={pageSize}
            onChange={pageChange}
            total={totalPage}
          />
        )}
      </div>
    </div>
  );
};

TaskTable.defaultProps = {
  loaders: 0,
  data: [],
  footer: <></>,
};

export default memo(TaskTable);
