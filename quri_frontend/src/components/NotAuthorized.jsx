// ** React Imports
import { Link } from "react-router-dom"

// ** Reactstrap Imports
import { Button } from "reactstrap"

import source from '../../src/assets/img/not-authorized.svg'

// ** Custom Hooks
// import { useSkin } from "@hooks/useSkin"

// ** Utils
// import {} from "@utils"

// ** Styles
// import "@styles/base/pages/page-misc.scss"

const NotAuthorized = () => {
  // ** Hooks
//   const { skin } = useSkin()

//   const illustration =
//       skin === "dark" ? "not-authorized-dark.svg" : "not-authorized.svg",
//     source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <a href="#" class="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back to Homepage</a>
        </div>   
    </div>
</section>
  )
}
export default NotAuthorized
