import React from 'react'
import './404.css'
const ErrorPage = () => {
  return (

    <div class="h-screen absolute
                  bg-cover bg-center
                bg-no-repeat">
      <div id='NotFoundDiv' class="h-screen  backdrop-blur-mms flex justify-center align-center flex-col">
        <h1 id='NotFoundTitle' class="text-9xl font-condensed text-center text-my-cyan">404</h1>
        <h2 id='NotFoundPage' class="text-2xl text-center text-my-grey">page not found</h2>
        <div class="text-center flex justify-center align-end pt-[495px] bg-light-blue-500">
          <a id='GoHome' href="/" class="text-2xl text-my-cyan  hover:text-my-grey"
          >Go home</a>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage