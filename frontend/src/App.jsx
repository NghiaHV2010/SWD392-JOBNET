// UploadCV.jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('cv', file);
    console.log(formData);


    const res = await axios.post('http://localhost:3000/api/v1/upload-cv', formData);
    // setJobs(res.data.jobs);
  };

  return (
    <div>
      <div className="flex gap-5 justify-center items-center">
        <label htmlFor="file-upload" className='cursor-pointer border rounded-lg p-2'>Upload file</label>
        <input
          id='file-upload'
          className=''
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => { 
            setFile(e.target.files[0]);        
          }}
        />
        <button onClick={handleUpload}>Upload CV</button>
      </div>

      <h3>Công việc gợi ý:</h3>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            <strong>{job.title}</strong> tại {job.company}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
