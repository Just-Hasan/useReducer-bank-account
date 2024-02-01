import { useEffect, useReducer } from "react";

import "./App.css";

const initialState = {
  active: false,
  balance: 0,
  loan: 0,
  depositValue: 0,
  withdrawValue: 0,
  loanValue: 0,
  notification: null,
};

const REDUCER_ACTION = {
  OPEN_ACC: "open",
  NEW_VALUE: "new_value",
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
  WITHDRAW_VALUE: "withdraw_value",
  WITHDRAW_ALL: "withdraw_all",
  REQUEST_LOAN_VALUE: "request_loan_value",
  REQUEST_LOAN: "request_loan",
  PAY_LOAN: "pay_loan",
  NOTIFICATION: "notification",
  CLOSE_ACC: "close_acc",
};

function reducer(state, action) {
  switch (action.type) {
    case REDUCER_ACTION.OPEN_ACC:
      return { ...state, active: true, balance: 500 };
    case REDUCER_ACTION.NEW_VALUE:
      return { ...state, depositValue: action.payload };
    case REDUCER_ACTION.DEPOSIT:
      return {
        ...state,
        balance: state.balance + state.depositValue,
        depositValue: 0,
      };
    case REDUCER_ACTION.WITHDRAW_VALUE:
      return { ...state, withdrawValue: action.payload };
    case REDUCER_ACTION.WITHDRAW:
      return {
        ...state,
        balance: state.balance - state.withdrawValue,
        withdrawValue: 0,
      };
    case REDUCER_ACTION.WITHDRAW_ALL:
      return { ...state, withdrawValue: 0, balance: 0 };
    case REDUCER_ACTION.REQUEST_LOAN_VALUE:
      return { ...state, loanValue: action.payload };
    case REDUCER_ACTION.REQUEST_LOAN:
      return {
        ...state,
        loan: state.loanValue,
        balance: state.balance + state.loanValue,
        loanValue: 0,
      };
    case REDUCER_ACTION.PAY_LOAN:
      return { ...state, balance: state.balance - state.loan, loan: 0 };
    case REDUCER_ACTION.NOTIFICATION:
      return { ...state, notification: action.payload };
    case REDUCER_ACTION.CLOSE_ACC:
      return initialState;

    default:
      break;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const id = setTimeout(() => {
      dispatch({ type: REDUCER_ACTION.NOTIFICATION, payload: null });
    }, 2000);
    return () => clearInterval(id);
  }, [state.notification]);
  const activeStyle = `p-4 text-2xl text-[#f4f4f4]  bg-[#868e96] hover:bg-[#495057] active:bg-[#343a40] rounded-lg`;
  const inactiveStyle = `p-4 text-2xl text-[#f4f4f4] cursor-default opacity-50 bg-[#868e96] rounded-lg`;

  return (
    <div className="h-[100vh] flex flex-col w-full gap-4 justify-center items-center">
      <h2 className=" text-[24px] font-black text-red-400 text-center">
        {state.notification}
      </h2>
      <h1 className="text-[36px] font-black mb-[24px] text-center">
        useReducer Bank Account
      </h1>
      <p className="text-2xl">Balance: {state.balance}</p>
      <p className="text-2xl">Loan: {state.loan}</p>
      <button
        className={!state.active ? activeStyle : inactiveStyle}
        onClick={() => dispatch({ type: REDUCER_ACTION.OPEN_ACC })}
        disabled={state.active}
      >
        Open account
      </button>
      <div className="flex gap-x-4">
        <input
          className="p-4 text-xl border-2 border-[#1c1c1c]"
          disabled={!state.active}
          onChange={(e) => {
            if (e.target.value < 0) return;
            dispatch({
              type: REDUCER_ACTION.NEW_VALUE,
              payload: Number(e.target.value),
            });
          }}
          type="number"
          placeholder={state.active ? "0" : ""}
          value={state.depositValue === 0 ? "" : state.depositValue}
        />
        <button
          onClick={() => dispatch({ type: REDUCER_ACTION.DEPOSIT })}
          className={state.active ? activeStyle : inactiveStyle}
        >
          Deposit
        </button>
      </div>
      <div className="flex gap-x-4">
        <input
          className="p-4 text-xl border-2 border-[#1c1c1c]"
          disabled={!state.active}
          type="number"
          value={state.withdrawValue === 0 ? "" : state.withdrawValue}
          placeholder={state.active ? "0" : ""}
          onChange={(e) => {
            if (e.target.value < 0) return;
            dispatch({
              type: REDUCER_ACTION.WITHDRAW_VALUE,
              payload: Number(e.target.value),
            });
          }}
        />
        <button
          className={state.active ? activeStyle : inactiveStyle}
          onClick={() => {
            if (state.withdrawValue > state.balance) {
              dispatch({
                type: REDUCER_ACTION.NOTIFICATION,
                payload: "Can't withdraw money you don't have",
              });
              return;
            }
            dispatch({ type: REDUCER_ACTION.WITHDRAW });
          }}
        >
          Withdraw
        </button>
        <button
          className={state.active ? activeStyle : inactiveStyle}
          onClick={() => dispatch({ type: REDUCER_ACTION.WITHDRAW_ALL })}
        >
          Withdraw all
        </button>
      </div>
      <div className="flex gap-x-4">
        <input
          className="p-4 text-xl border-2 border-[#1c1c1c]"
          disabled={!state.active}
          type="number"
          value={state.loanValue === 0 ? "" : state.loanValue}
          placeholder={state.active ? "0" : ""}
          onChange={(e) => {
            if (Number(e.target.value < 0)) return;
            dispatch({
              type: REDUCER_ACTION.REQUEST_LOAN_VALUE,
              payload: Number(e.target.value),
            });
          }}
        ></input>
        <button
          className={
            state.active && state.loan === 0 ? activeStyle : inactiveStyle
          }
          onClick={() => dispatch({ type: REDUCER_ACTION.REQUEST_LOAN })}
          disabled={state.loan > 0}
        >
          Request Loan
        </button>
      </div>
      <button
        className={state.active ? activeStyle : inactiveStyle}
        onClick={() => {
          if (state.loan > state.balance) {
            dispatch({
              type: REDUCER_ACTION.NOTIFICATION,
              payload: "Your balance is not enough",
            });
            return;
          }
          dispatch({ type: REDUCER_ACTION.PAY_LOAN });
        }}
      >
        Pay Loan
      </button>
      <button
        className={state.active ? activeStyle : inactiveStyle}
        onClick={() => {
          if (state.balance > 0 || state.loan > 0) {
            dispatch({
              type: REDUCER_ACTION.NOTIFICATION,
              payload: "Pay your loan / withdraw all of your money please",
            });
          } else {
            dispatch({ type: REDUCER_ACTION.CLOSE_ACC });
          }
        }}
      >
        Close account
      </button>
    </div>
  );
}

export default App;
