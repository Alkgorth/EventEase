// page ajout et modification d'un événement.

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";

import { commonStyles } from "../styles/commonStyles";

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

export default function EventFormScreen({ navigation }: Props) {
    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Formulaire d'événement</Text>
        </View>
    );
}