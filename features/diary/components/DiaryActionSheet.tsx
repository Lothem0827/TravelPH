import React from 'react';
import { View, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import AppText from '@/components/AppText';
import Button from '@/components/Button';

interface DiaryActionSheetProps {
    visible: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const DiaryActionSheet: React.FC<DiaryActionSheetProps> = ({ visible, onEdit, onDelete, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-end">
                    <TouchableWithoutFeedback>
                        <View className="bg-white rounded-t-3xl p-6 pb-10 gap-4">


                            <Button
                                title="Edit diary"
                                onPress={onEdit}
                                variant="primary"
                            />

                            <Button
                                title="Remove from diary"
                                onPress={onDelete}
                                variant="outline"
                                className="border-slate-200 active:bg-slate-50"
                                textClassName="text-slate-700"
                            />

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DiaryActionSheet;
