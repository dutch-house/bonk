import { setupListeners } from "@reduxjs/toolkit/query/react";
import {
	type Action,
	type ThunkAction,
	combineSlices,
	configureStore,
} from "@reduxjs/toolkit/react";
import { useDispatch, useSelector } from "react-redux";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	persistReducer,
	persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { AppName, PersistVersion } from "../static/app";
import { AppSlice } from "./app";

const RootState = combineSlices(AppSlice);
export type RootState = ReturnType<typeof RootState>;

const PersistedReducer = persistReducer(
	{
		key: AppName,
		storage,
		version: Number(PersistVersion) ?? 0,
		// Data serialization is not required and disabling it allows you to inspect storage value in DevTools; Available since redux-persist@5.4.0
		serialize: import.meta.env.VITE_FLAG_BETA ?? true,
		blacklist: [],
	},
	RootState,
);

export const RootStore = (() => {
	const store = configureStore({
		devTools: import.meta.env.VITE_FLAG_BETA,
		reducer: PersistedReducer,

		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}).concat([]),
	});
	setupListeners(store.dispatch);
	return store;
})();

export default RootStore;

export const RootStorePersistor = persistStore(RootStore);

export type RootStore = typeof RootStore;
export type RootDispatch = RootStore["dispatch"];
export type RootThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>;
export const useRootDispatch = useDispatch.withTypes<RootDispatch>();
export const useRootSelector = useSelector.withTypes<RootState>();
