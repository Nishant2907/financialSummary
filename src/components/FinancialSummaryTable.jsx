import React, { useState } from 'react';
import { ReactSortable } from "react-sortablejs";
import list from '../data/financialData.json';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
const App = () => {
  const [state, setState] = useState(list);
  const [currency, setCurrency] = useState('USD');
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    EUR: 0.92,
    GBP: 0.78
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleDecimalPlacesChange = (e) => {
    setDecimalPlaces(parseInt(e.target.value));
  };

  const formatValue = (value) => {
    const convertedValue = value * exchangeRates[currency];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(convertedValue);
  };

  return (
    <div className="container mx-auto p-4 w-full">
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
      <div className=" w-[1250px] h-96  overflow-auto border-4 border-gray-200 rounded-md">
        <table className=" bg-white border border-gray-200">
          <thead>
            <tr className='bg-white sticky top-0 z-20'>
              <th className="px-4 py-2 bg-white border-b border-x-white sticky left-0"></th>
              <th className="px-4 py-2 bg-white border-b sticky left-10 top-0 z-10">Cashflow</th>
              {months.map((month, index) => (
                <th key={index} className="px-4 py-2 border-b w-2 ">{month}</th>
              ))}
            </tr>
          </thead>
          <ReactSortable
            tag="tbody"
            list={state}
            setList={setState}
            animation={150}
            handle=".handle"
          >
            {state.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 w-full z-10">
                <td className="px-4 py-2 bg-white border-b sticky left-0">
                  <span className="handle cursor-move">::</span>
                </td>
                <td className=" py-2 bg-white border-b sticky left-10">{item.Overhead}</td>
                {Object.keys(item).map((key) => {
                  if (/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(key)) {
                    return (
                      <td key={key} className="px-4 py-2 border border-b">
                        {formatValue(item[key])}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </ReactSortable>
        </table>
      </div>
    </div>
  );
};

export default App;
