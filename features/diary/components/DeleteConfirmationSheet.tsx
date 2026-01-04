import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import AppText from '@/components/AppText';
import Button from '@/components/Button';

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
                        <View className="bg-white rounded-t-3xl p-6 pb-10 gap-5">


                            <View className="gap-1.5">
                                <AppText variant="BodyBoldLarge" >Remove this diary?</AppText>
                                <AppText variant="Body" className="text-slate-500">
                                    This entry will be removed from your diary.
                                    You can add it again anytime.
                                </AppText>
                            </View>

                            <View className="bg-yellow-50 rounded-2xl p-3.5 flex-row items-center gap-1.5  ">
                                <AppText variant="AlertText" className="flex-1">
                                    Photos will be hidden but kept for your next visit.
                                </AppText>
                            </View>

                            <View className="gap-3">
                                <Button
                                    title="Yes, remove"
                                    className="!bg-slate-700 !active:bg-slate-800 "
                                    textClassName="!text-white"
                                    onPress={onConfirm}
                                />

                                <Button
                                    title="Cancel"
                                    variant="outline"
                                    className="!border-slate-300 active:!bg-slate-50"
                                    textClassName="!text-slate-700"
                                    onPress={onCancel}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DeleteConfirmationSheet;
