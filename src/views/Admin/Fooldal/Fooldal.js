import React from "react";

const Fooldal = (props) => {
  const { user } = props;

  return (
    <div className="row">
      <div className="col-md-12">{`Üdvözlöm ${user.username}!`}</div>
    </div>
  );
};

export default Fooldal;
