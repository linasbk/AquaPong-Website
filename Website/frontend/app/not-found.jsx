import './error.css';
import DynamicNotFoundButton from './components/ErrorPage/notfound-button';


  const errorMessages = {
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '403': 'Forbidden',
    '404': 'Page Not Found',
    '500': 'Internal Server Error',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout'
  };
  const NotFound = ({params}) => {
    let error = errorMessages[params];
    error = error === undefined ? (params = '404', errorMessages[params]) : error;
    return (
        <div className="h-full w-full fixed  bg-[url(assets/404.png)]  bg-cover bg-center bg-no-repeat">
          <div className="h-screen  backdrop-blur-mms flex justify-center align-center flex-col drop-shadow-lg">
              <h1 className={"text-9xl font-condensed text-center text-my-cyan NotFoundTitle"}>
              {params}
              </h1>
              <h2 className="text-2xl text-center text-my-grey pt-[2%]">
              {error}
              </h2>
              <div className="text-center flex justify-center align-end pt-[30%]">
              <DynamicNotFoundButton>
                  <button className="text-2xl text-my-cyan  hover:text-my-grey hover:shadow-my-grey drop-shadow-[2px_2px_2px_var(--tw-shadow-color)] shadow-my-cyan">
                  Go home
                  </button>
              </DynamicNotFoundButton>
              </div>
          </div>
        </div>
    );
  }
export default NotFound;
