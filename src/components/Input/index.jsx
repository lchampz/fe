import { useState, memo, useId } from "react";
import CookieShow from "../../assets/pass-icon-show.png";
import CookieOcult from "../../assets/pass-icon-ocult.png";

import "./styled.scss";

const Input = memo(({ state, setState, placeholder, password = false, type = "text", name, width = "fit-content", padding }) => {
  const [visiblePass, setVisiblePass] = useState(false);
  const handleChangePassVisibility = () => setVisiblePass(prev => !prev);

  let focusedElement = document.activeElement.id;
  const id = `${name}_id`;

  const handleChange = (e) => {
    const _state = {...state, [e.target.name]: e.target.value};
    setState(_state);
  }

  return (
    <div className="pass-wrapper" style={{ width }}>
      <input
        id={id}
        key={`${name}_key`}
        style={{ padding }}
        name={name}
        onChange={handleChange}
        value={state[name]}
        placeholder={placeholder}
        type={!password ? type : visiblePass ? "text" : "password"}
        className="custom-input"
        {...focusedElement === id ? {autoFocus: true} : {}}
      />
      {password && (
        <img
          className="pass-visibility-icon"
          onClick={handleChangePassVisibility}
          src={visiblePass ? CookieShow : CookieOcult}
          alt="mudar visibilidade da senha"
        />
      )}
    </div>
  );
});

export default Input;
