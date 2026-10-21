import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},

	title: {
		fontSize: 24,
		marginBottom: 20
	},

	input: {
		width: "80%",
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 10,
		paddingHorizontal: 10,
	},

	errorText: {
		color: "red",
		marginBottom: 10,
	},
});