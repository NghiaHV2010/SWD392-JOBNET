import React from 'react'

export const FileUpload = () => {
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
  )
}
