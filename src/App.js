import React, { useState } from 'react';
import VirtualizedTable from './components/VirtualizedTable'
import FinancialSummaryTable from './components/FinancialSummaryTable';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function App() {
  const [alignment, setAlignment] = useState('sortable');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="sortable">Sortable Table</ToggleButton>
        <ToggleButton value="virtualized">Virtualized Table</ToggleButton>
      </ToggleButtonGroup>
      {alignment === 'sortable' && <FinancialSummaryTable />}
      {alignment === 'virtualized' && <VirtualizedTable />}
    </div>

  );
}

export default App;
