import React from 'react'
import Button from '../../Components/Button'

const NotFound = () => {
  return (
    <div className="d-flex justify-content-start align-items-center flex-column w-100 h-auto" id="main">
      <div className="d-flex justify-content-start align-items-center flex-column w-75 h-auto">
        <h1 className="m-2"><b style={{ "color": "var(--bs-danger)" }}>404</b> Page not found</h1>
        <p style={{ "color": "var(--bs-secondary-color)" }}>
          Oops! The page you’re looking for doesn’t exist or has been moved. <br />
          Check the URL or go back to the homepage
          .</p>

        <Button
          buttonType="primary"
          className='d-flex justify-content-center align-items-center'
          onClickEvent={() => {
            window.location.href = "/"
          }}
        >
          Return to main page
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right m-1  " viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
            <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export default NotFound