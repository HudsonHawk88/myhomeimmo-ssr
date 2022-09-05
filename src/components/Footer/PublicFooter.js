import React from "react";

const PublicFooter = () => {
  return (
    <footer className="public-footer" id="public_footer">
      <div className="container-fluid public-footer__div">
        <span>
          {`Designed and created by`}&nbsp;
          <a id="inftechsol_link" href="https://inftechsol.hu" target="_blank">
            Inftechsol
          </a>{" "}
          <sup>
            <i aria-hidden className="far fa-copyright"></i>
          </sup>
        </span>
      </div>
    </footer>
  );
};

export default PublicFooter;
