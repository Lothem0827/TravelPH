import React from 'react';
import { View, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import AppText from '@/components/AppText';

interface DeleteConfirmationSheetProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationSheet: React.FC<DeleteConfirmationSheetProps> = ({ visible, onConfirm, onCancel }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View className="flex-1 bg-black/50 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-t-3xl p-6 pb-10 gap-6">


                            <View className="gap-2">
                                <AppText variant="H2" >Remove this diary?</AppText>
                                <AppText variant="Body" className="text-slate-500">
                                    This entry will be removed from your diary.
                                    You can add it again anytime.
                                </AppText>
                            </View>

                            <View className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                <AppText variant="Body" className="text-yellow-800 font-medium">
                                    Photos will be hidden but kept for your next visit.
                                </AppText>
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="w-full bg-slate-700 py-4 rounded-xl items-center"
                                    onPress={onConfirm}
                                >
                                    <AppText variant="Action" className="text-white font-semibold">Yes, remove</AppText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="w-full bg-white border border-slate-200 py-4 rounded-xl items-center"
                                    onPress={onCancel}
                                >
                                    <AppText variant="Action" className="text-slate-700 font-semibold">Cancel</AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DeleteConfirmationSheet;
