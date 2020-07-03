import React from "react";
import UserInterface from "../components/UserInterface";
import style from "./style";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Provider } from "react-redux";
import store from "../store";

function App() {
  return (
    <Provider store={store}>
      <div style={style}>
        <Header />
        <UserInterface />
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
