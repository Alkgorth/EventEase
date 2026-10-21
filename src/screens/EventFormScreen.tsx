// page ajout et modification d'un événement.
import { useState, useEffect } from "react";
import { Button, Text, TextInput } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { commonStyles } from "../styles/commonStyles";
import { FormContainer } from "../components/FormContainer";
import { addEvent, getEventById, updateEvent } from "../storage/eventStorage";
import { EventItem } from "../types";
import { formatDateInput, parseDateInput, isoToDateInput } from "../utils/dateUtils"

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

export default function EventFormScreen({ navigation, route }: Props) {
    const eventId = route.params?.eventId;
    const isEditing = eventId !== undefined;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [participated, setParticipated] = useState(false);
    useEffect(() => {
        if (!eventId) return;
        async function loadEvent() {
            const event = await getEventById(eventId!);
            if (event) {
                setTitle(event.title);
                setDescription(event.description);
                setDate(isoToDateInput(event.date));
                setParticipated(event.participated);
            }
        }
        loadEvent();
    }, [eventId]);

    async function handleSave() {
        if (saving) return;

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const isoDate = parseDateInput(date);

        // 1. Validation des champs obligatoires
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

        // 2. Préparation de l'objet événement (on garde l'id et le statut 'participated' en modification)
        const eventData: EventItem = {
            id: isEditing ? eventId : Date.now().toString(),
            title: trimmedTitle,
            description: trimmedDescription,
            date: isoDate,
            participated: participated,
        };

        setSaving(true);

        // 3. Enregistrement sécurisé
        try {
            if (isEditing) {
                await updateEvent(eventData);
            } else {
                await addEvent(eventData);
            }
            // Retour à la liste : useFocusEffect sur EventListScreen rechargera les données automatiquement
            navigation.goBack();
        } catch {
            setError("Une erreur est survenue lors de l'enregistrement.");
            setSaving(false);
        }
    }

    return (
        <FormContainer>
            <Text style={commonStyles.title}>
                {isEditing ? "Modifier l'évènement" : "Ajouter un événement"}
            </Text>

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
                title={saving ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Enregistrer l'événement")}
                onPress={handleSave}
                disabled={saving}
            />
        </FormContainer>
    );
}