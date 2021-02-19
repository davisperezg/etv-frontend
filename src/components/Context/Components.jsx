import { createContext } from "react";

const StatusContext = createContext({});

const StatusProvider = StatusContext.Provider;
const StatusConsumer = StatusContext.Consumer;

export { StatusProvider, StatusConsumer, StatusContext };
