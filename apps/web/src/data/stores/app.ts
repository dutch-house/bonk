import { createAsyncSlice } from "@/utils/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StoreSlicePrefix } from "../static/store";

import { z } from "zod";

// * =============================================================================================
// * SCHEMAS

export const Theme = z.enum(["dark", "light"]);
export type Theme = z.infer<typeof Theme>;

// * =============================================================================================

const Name = `${StoreSlicePrefix}app`;
const State = z.object({
	theme: Theme.default("light"),
});
type State = z.infer<typeof State>;

const InitialState: State = State.parse({});

export const AppSlice = createAsyncSlice({
	name: Name,
	initialState: InitialState,
	reducers: (create) => ({
		reset: () => InitialState,

		setTheme: create.reducer((state, action: PayloadAction<State["theme"]>) => {
			state.theme = action.payload;
		}),
	}),
	selectors: {
		state: (state) => state,
	},
});

export const AppActions = AppSlice.actions;
export const AppSelectors = AppSlice.selectors;
