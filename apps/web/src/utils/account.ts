import type { Address } from "viem/accounts";

export const getTruncatedAddress = ({
	address = "0x",
	startChars = 6,
	endChars = 4,
}: {
	address?: Address;
	startChars?: number;
	endChars?: number;
}): string => {
	if (address.length > startChars + endChars + 3) {
		return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
	}
	return address;
};
