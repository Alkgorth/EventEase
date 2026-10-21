// page ajout et modification d'un événement.
import { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { commonStyles } from "../styles/commonStyles";
import { FormContainer } from "../components/FormContainer";
import { addEvent } from "../storage/eventStorage";
import { EventItem } from "../types";
import { formatDateInput, parseDateInput } from "../utils/dateUtils"

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

export default function EventFormScreen({ navigation }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (saving) return;

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const isoDate = parseDateInput(date);

        if (!trimmedTitle) {
            setError("Veuillez remplir le titre.");
            return;
        }

        if (!trimmedDescription) {
            setError("Veuillez remplir la description.");
            return;
        }

        if (!isoDate) {
            setError("Date invalide : utilisez le format JJ/MM/AAAA.");
            return;
        }

        // Création du nouvel événement conforme au modèle EventItem
        const newEvent: EventItem = {
            id: Date.now().toString(),
            title: trimmedTitle,
            description: trimmedDescription,
            date: isoDate,
            participated: false,
        };

        setSaving(true)

        // Enregistrement sécurisé avec try / catch
        try {
            await addEvent(newEvent);
            // Retour à la liste : useFocusEffect sur EventListScreen rechargera les données automatiquement
            navigation.goBack();
        } catch {
            setError("Une erreur est survenue lors de l'enregistrement.");
            setSaving(false);
        }
    }

    return (
        <FormContainer>
            <Text style={commonStyles.title}>Ajouter un événement</Text>

            <TextInput
                style={commonStyles.input}
                placeholder="Titre de l'événement"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[commonStyles.input, { height: 100, textAlignVertical: "top" }]}
                multiline
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={commonStyles.input}
                placeholder="Date de l'événement (JJ/MM/AAAA)"
                keyboardType="numeric"
                maxLength={10}
                value={date}
                onChangeText={(text) => setDate(formatDateInput(text))}
            />
            {error !== "" && <Text style={commonStyles.errorText}>{error}</Text>}

            <Button
                title={saving ? "Enregistrement..." : "Enregistrer l'événement"}
                onPress={handleSave}
                disabled={saving}
            />
        </FormContainer>
    );
}