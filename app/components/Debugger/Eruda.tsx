import eruda from "eruda";
import React from "react";

const Eruda: React.FC<{}> = () => {
  React.useEffect(() => {
    eruda.init();
    eruda.show();
  }, []);

  return null;
};

export default Eruda;
