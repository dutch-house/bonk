import { RootStore, RootStorePersistor } from "@/data/stores/root";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export const ReduxProvider = ({ children }: PropsWithChildren) => (
	<Provider store={RootStore}>
		<PersistGate loading={null} persistor={RootStorePersistor}>
			{children}
		</PersistGate>
	</Provider>
);

export default ReduxProvider;
