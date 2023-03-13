import React from 'react';

const PublicFooter = (props) => {
    const { mainUrl } = props;
    return (
        <footer className="public-footer" id="public_footer">
            <div className="public-footer__div">
                <div className="copyright">
                    {`Designed and created by`}&nbsp;
                    <a id="inftechsol_link" href="https://inftechsol.hu" target="_blank">
                        Inftechsol
                    </a>{' '}
                    <sup>
                        <i aria-hidden className="far fa-copyright"></i>
                    </sup>
                </div>
                <br />
                <div className="linkek">
                    <a href={mainUrl + '/adatkezeles'}>Adatkezelési nyilatkozat</a>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
