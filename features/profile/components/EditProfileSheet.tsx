import React, { useState, useEffect } from 'react';
import { View, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { useProfileStore } from '@/store/useProfileStore';

interface EditProfileSheetProps {
    visible: boolean;
    onClose: () => void;
}

export default function EditProfileSheet({ visible, onClose }: EditProfileSheetProps) {
    const { displayName, bio, setProfile } = useProfileStore();
    const [name, setName] = useState(displayName);
    const [bioText, setBioText] = useState(bio);

    useEffect(() => {
        if (visible) {
            setName(displayName);
            setBioText(bio);
        }
    }, [visible, displayName, bio]);

    const handleSave = () => {
        setProfile({ displayName: name, bio: bioText });
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="bg-white rounded-t-3xl p-6 h-[60%]"
                >
                    <View className="flex-row justify-between items-center mb-6">
                        <TouchableOpacity onPress={onClose}>
                            <AppText className="text-slate-500">Cancel</AppText>
                        </TouchableOpacity>
                        <AppText className="font-semibold text-lg text-slate-800">Edit Profile</AppText>
                        <TouchableOpacity onPress={handleSave}>
                            <AppText className="text-slate-800 font-bold">Save</AppText>
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-6">
                        <View>
                            <AppText className="text-slate-500 text-xs uppercase mb-2">Display Name</AppText>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="bg-slate-50 p-4 rounded-xl text-slate-800 font-sans"
                                placeholder="Enter your name"
                            />
                        </View>

                        <View>
                            <AppText className="text-slate-500 text-xs uppercase mb-2">Bio</AppText>
                            <TextInput
                                value={bioText}
                                onChangeText={setBioText}
                                className="bg-slate-50 p-4 rounded-xl text-slate-800 font-sans"
                                placeholder="Write a short note..."
                                multiline
                                maxLength={80}
                                style={{ height: 100, textAlignVertical: 'top' }}
                            />
                            <AppText className="text-right text-xs text-slate-300 mt-1">{bioText?.length || 0}/80</AppText>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}
