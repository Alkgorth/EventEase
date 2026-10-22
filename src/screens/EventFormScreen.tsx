// src/screens/EventFormScreen.tsx

import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "../navigation/AppNavigator";
import { commonStyles } from "../styles/commonStyles";
import { borderRadius, colors, fonts } from "../styles/theme";
import { FormContainer } from "../components/FormContainer";
import { DeleteModal } from "../components/DeleteModal";
import { CalendarModal } from "../components/CalendarModal";
import { addEvent, deleteEvent, getEventById, updateEvent } from "../storage/eventStorage";
import { EventItem } from "../types";
import { formatDateInput, parseDateInput, isoToDateInput } from "../utils/dateUtils";

type Props = NativeStackScreenProps<RootStackParamList, "EventForm">;

export default function EventFormScreen({ navigation, route }: Props) {
    const insets = useSafeAreaInsets();
    const eventId = route.params?.eventId;
    const isEditing = eventId !== undefined;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    // En création, loaded vaut true dès le départ ; en modification, on attend le chargement
    const [loaded, setLoaded] = useState(!isEditing);
    const [participated, setParticipated] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        async function loadEvent() {
            const event = await getEventById(eventId!);
            if (event) {
                setTitle(event.title);
                setDescription(event.description);
                setDate(isoToDateInput(event.date));
                setParticipated(event.participated);
                setLoaded(true);
            } else {
                setError("Cet événement n'existe plus.");
            }
        }

        loadEvent();
    }, [eventId]);

    async function handleSave() {
        if (saving || !loaded) return;

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const isoDate = parseDateInput(date);

        // 1. Validation des champs obligatoires
        if (!trimmedTitle) {
            setError("Veuillez remplir le titre de l'événement.");
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

        // 2. Préparation de l'objet événement conforme à EventItem
        const eventData: EventItem = {
            id: isEditing ? eventId : Date.now().toString(),
            title: trimmedTitle,
            description: trimmedDescription,
            date: isoDate,
            participated: participated,
        };

        setSaving(true);

        // 3. Enregistrement sécurisé dans AsyncStorage
        try {
            if (isEditing) {
                await updateEvent(eventData);
            } else {
                await addEvent(eventData);
            }
            // Retour automatique à la liste rechargée par useFocusEffect
            navigation.goBack();
        } catch {
            setError("Une erreur est survenue lors de l'enregistrement.");
            setSaving(false);
        }
    }

    async function handleConfirmDelete() {
        if (!eventId) return;
        setSaving(true);
        try {
            await deleteEvent(eventId);
            setShowDeleteModal(false);
            navigation.goBack();
        } catch {
            setError("Une erreur est survenue lors de la suppression.");
            setSaving(false);
            setShowDeleteModal(false);
        }
    }

    if (isEditing && !loaded && !error) {
        return (
            <FormContainer
                contentContainerStyle={[
                    styles.contentPadding,
                    { paddingTop: Math.max(insets.top, 16) },
                ]}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                    accessibilityLabel="Retour"
                >
                    <Feather name="arrow-left" size={24} color={colors.primary} />
                    <Text style={styles.headerTitle}>Modifier l{"'"}événement</Text>
                </TouchableOpacity>
                <View style={styles.loadingCenter}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </FormContainer>
        );
    }

    return (
        <FormContainer
            contentContainerStyle={[
                styles.contentPadding,
                { paddingTop: Math.max(insets.top, 16) },
            ]}
        >
            {/* Barre de retour supérieure avec flèche et titre de page */}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
                accessibilityLabel="Retour"
            >
                <Feather name="arrow-left" size={24} color={colors.primary} />
                <Text style={styles.headerTitle}>
                    {isEditing ? "Modifier l'événement" : "Nouvel événement"}
                </Text>
            </TouchableOpacity>

            {/* Grand titre et sous-titre chaleureux conformes à la maquette */}
            <Text style={commonStyles.authTitle}>
                {isEditing ? "Modifions cet événement" : "Créons des moments ensemble"}
            </Text>
            <Text style={commonStyles.authSubtitle}>
                {isEditing
                    ? "Ajustez les informations de votre événement."
                    : "Proposez une rencontre aux membres de l'association."}
            </Text>

            {/* Champ 1 : Titre de l'événement */}
            <TextInput
                style={commonStyles.input}
                placeholder="Titre de l'événement"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
            />

            {/* Champ 2 : Description multiligne */}
            <TextInput
                style={[
                    commonStyles.input,
                    styles.descriptionInput,
                ]}
                multiline
                placeholder="Description"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
            />

            {/* Champ 3 : Date au format JJ/MM/AAAA avec icône calendrier cliquable */}
            <View style={commonStyles.inputWithIcon}>
                <TextInput
                    style={commonStyles.inputField}
                    placeholder="Date (JJ/MM/AAAA)"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    maxLength={10}
                    value={date}
                    onChangeText={(text) => setDate(formatDateInput(text))}
                />
                <TouchableOpacity
                    onPress={() => setShowCalendarModal(true)}
                    activeOpacity={0.7}
                    accessibilityLabel="Ouvrir le calendrier"
                >
                    <Feather name="calendar" size={20} color={colors.primary} style={commonStyles.inputIcon} />
                </TouchableOpacity>
            </View>

            {error !== "" && <Text style={commonStyles.errorText}>{error}</Text>}

            {/* Bouton principal de création / mise à jour */}
            <TouchableOpacity
                style={[
                    commonStyles.primaryButton,
                    (saving || !loaded) && { opacity: 0.5 },
                ]}
                onPress={handleSave}
                disabled={saving || !loaded}
                activeOpacity={0.8}
            >
                <Text style={commonStyles.primaryButtonText}>
                    {saving
                        ? "Enregistrement..."
                        : isEditing
                        ? "Mettre à jour"
                        : "Créer l'événement"}
                </Text>
            </TouchableOpacity>

            {/* Bouton Supprimer l'événement (visible uniquement en mode modification si l'événement existe) */}
            {isEditing && loaded && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setShowDeleteModal(true)}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    <Feather name="trash-2" size={16} color={colors.danger} style={{ marginRight: 8 }} />
                    <Text style={styles.deleteButtonText}>Supprimer l{"'"}événement</Text>
                </TouchableOpacity>
            )}

            {/* Mention informative rassurante en bas de formulaire */}
            <Text style={styles.footerNotice}>
                Enregistré sur cet appareil. Vous pourrez le modifier ou le supprimer à tout moment.
            </Text>

            {/* Modale de confirmation de suppression personnalisée */}
            <DeleteModal
                visible={showDeleteModal}
                eventTitle={title || "Cet événement"}
                eventDate={parseDateInput(date) || undefined}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* Modale de sélection de date interactive avec react-native-calendars */}
            <CalendarModal
                visible={showCalendarModal}
                currentDate={date}
                onSelectDate={(formattedDate) => {
                    setDate(formattedDate);
                    setError("");
                }}
                onClose={() => setShowCalendarModal(false)}
            />
        </FormContainer>
    );
}

const styles = StyleSheet.create({
    contentPadding: {
        paddingBottom: 40,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    headerTitle: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.primary,
        marginLeft: 12,
    },
    descriptionInput: {
        height: 110,
        textAlignVertical: "top",
        paddingTop: 14,
    },
    loadingCenter: {
        paddingVertical: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    footerNotice: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.textMuted,
        textAlign: "center",
        marginTop: 6,
        lineHeight: 18,
        paddingHorizontal: 16,
    },
    deleteButton: {
        height: 50,
        borderRadius: borderRadius.medium,
        borderWidth: 1,
        borderColor: "#FCA5A5",
        backgroundColor: "#FEF2F2",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        marginBottom: 8,
    },
    deleteButtonText: {
        fontFamily: fonts.bold,
        fontSize: 15,
        color: colors.danger,
    },
});
