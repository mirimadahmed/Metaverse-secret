import React from "react";
import { NavLink , NavIcon , NavItems } from "./Social.elements";

function Social() {

    const socialMedia = (url) => {
        window.location.href = url;
      };

  return (
    <>
         <div className="flexContainer">
             <div className="flexItems">
               <a href="https://opensea.io/collection/metaversessecret"> <img src={"config/images/opensea.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://www.instagram.com/metaversessecret/"> <img src={"config/images/instagram.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://twitter.com/MVSecretNFT"><img src={"config/images/twitter.png"}  /></a>
             </div>
             <div className="flexItems">
             <a href="https://discord.com/invite/fRgfwXEUzq"> <img src={"config/images/discord.png"} /></a>
             </div>
         </div>
    </>
  )
}

export default Social