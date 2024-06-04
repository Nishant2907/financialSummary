import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "react-virtualized/styles.css";
import { Table, Column, AutoSizer, CellMeasurerCache } from "react-virtualized";
import jsonData from "../data/financialData.json";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
const conversionRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (style, isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nice
  userSelect: "none",
  // change background colour if dragging
  background: isDragging ? "lightblue" : "inherit",
  // styles we need to apply on draggables
  ...draggableStyle,
  ...style,
});

const rowCache = {};


const App = () => {
  const [items, setItems] = useState(jsonData);
  const [currency, setCurrency] = useState("USD");
  const [decimalPlaces, setDecimalPlaces] = useState(2);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleDecimalPlacesChange = (event) => {
    setDecimalPlaces(parseInt(event.target.value, 10));
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
  };

  const getRowRender = (virtualizedRowProps) => {
    const item = items[virtualizedRowProps.index];

    rowCache[virtualizedRowProps.index] = virtualizedRowProps;
    return (
      <Draggable
        draggableId={item.id}
        index={virtualizedRowProps.index}
        key={item.id}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            // {...provided.dragHandleProps}
            key={virtualizedRowProps.key}
            className={virtualizedRowProps.className}
            style={getItemStyle(
              virtualizedRowProps.style,
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <div {...provided.dragHandleProps} className="mx-[2px]">
              ::
            </div>
            {virtualizedRowProps.columns}
          </div>
        )}
      </Draggable>
    );
  };

  const onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(600);
    }
  };

  const formatValue = (value) => {
    const convertedValue = value * conversionRates[currency];
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(convertedValue);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center w-full">
        <h1 className="text-2xl font-bold w-full">Cashflow Summary</h1>
        <div className="flex justify-end w-full">
          <div className="mx-2">
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Cur</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currency}
                label="Age"
                onChange={handleCurrencyChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
              </Select>
              <FormHelperText>Currency</FormHelperText>
            </FormControl>
          </div>
          <div className="mx-2">
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Dec</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={decimalPlaces}
                label="Age"
                onChange={handleDecimalPlacesChange}
              >
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
              </Select>
              <FormHelperText>Decimal</FormHelperText>
            </FormControl>
          </div>
        </div>
      </div>

      <div className=" w-[1250px] overflow-auto h-[397px] border">
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          <Droppable
            droppableId="droppable"
            mode="virtual"
            renderClone={(provided, snapshot, rubric) => {
              const virtualizedRowProps = rowCache[rubric.source.index];
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  // {...provided.dragHandleProps}
                  key={virtualizedRowProps.key}
                  className={virtualizedRowProps.className}
                  style={getItemStyle(
                    { margin: 0 },
                    snapshot.isDragging,
                    provided.draggableProps.style
                  )}
                >
                  <div {...provided.dragHandleProps} className="mx-3">
                    ::
                  </div>
                  {virtualizedRowProps.columns}
                </div>
              );
            }}
          >
            {(provided, snapshot) => (
              <AutoSizer>
                {({ height, width }) => (
                  <Table
                    tableId="reactVirtaualizedTable"
                    rowIdKey="id"
                    {...provided.droppableProps}
                    rowCount={items.length}
                    width={2000}
                    height={400}
                    headerHeight={40}
                    rowHeight={60}
                    useDynamicRowHeight="true"
                    rowGetter={({ index }) => items[index]}
                    rowStyle={{
                      border: "solid",
                      "border-width": "0.1px",
                      "border-color": "lightgray",
                    }}
                    headerStyle={{ "text-align": "center", margin: "0px","text-transform": "capitalize" }}
                    gridStyle={{ "text-align": "center" }}
                    ref={(ref) => {
                      // react-virtualized has no way to get the list's ref that I can so
                      // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                      if (ref) {
                        // eslint-disable-next-line react/no-find-dom-node
                        const whatHasMyLifeComeTo =
                          document.getElementsByClassName(
                            "ReactVirtualized__Grid ReactVirtualized__Table__Grid"
                          )[0];
                        if (whatHasMyLifeComeTo instanceof HTMLElement) {
                          provided.innerRef(whatHasMyLifeComeTo);
                        }
                      }
                    }}
                    rowRenderer={getRowRender}
                  >
                    <Column
                      label="Cashflow"
                      key="Overhead"
                      dataKey="Overhead"
                      flexGrow={0.5}
                      width={200}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                    />
                    <Column
                      label="January"
                      key="Jan"
                      dataKey="Jan"
                      flexGrow={0.5}
                      width={150}
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                    />
                    <Column
                      label="February"
                      dataKey="Feb"
                      key="Feb"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="March"
                      dataKey="March"
                      key="March"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="April"
                      dataKey="April"
                      key="April"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="May"
                      dataKey="May"
                      key="May"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="June"
                      dataKey="June"
                      key="June"
                      flexGrow={0.5}
                      width={150}
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                    />
                    <Column
                      label="July"
                      dataKey="July"
                      key="July"
                      flexGrow={0.5}
                      width={150}
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                    />
                    <Column
                      label="August"
                      dataKey="August"
                      key="August"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="September"
                      dataKey="September"
                      key="September"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="October"
                      dataKey="October"
                      key="October"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="November"
                      dataKey="November"
                      key="November"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                    <Column
                      label="December"
                      dataKey="December"
                      key="December"
                      flexGrow={0.5}
                      width={150}
                      className="border-r py-[18px] m-0 border-r-lightgray"
                      cellRenderer={({ cellData }) => formatValue(cellData)}
                    />
                  </Table>
                )}
              </AutoSizer>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
