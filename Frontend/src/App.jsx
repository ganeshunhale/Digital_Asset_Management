import React from 'react'
import FileManagerControls from './components/FileManagerControls.jsx';
import { useState } from 'react';
import { CardHeader } from '@mui/material';

const App = () => {
   const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [fileType, setFileType] = useState('all');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploading file:', file.name);
    }
  };
  return (
    <div>
      <h1 className='text-center'>Digital asset management</h1>
       <FileManagerControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        fileType={fileType}
        onFileTypeChange={setFileType}
        onFileUpload={handleUpload}
      />
    </div>
  )
}

export default App
