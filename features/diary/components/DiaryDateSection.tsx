import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import CalendarIcon from '@/assets/icons/calendar-icon.svg';
import Button from '@/components/Button';
import AppText from '@/components/AppText';

interface DiaryDateInputProps {
    startDate: Date;
    endDate: Date;
    onDateClick: (type: 'start' | 'end') => void;
    formatDate: (date: Date) => string;
}

export const DiaryDateInput: React.FC<DiaryDateInputProps> = ({
    startDate,
    endDate,
    onDateClick,
    formatDate,
}) => {
    return (
        <View className="flex-col gap-2">
            <AppText variant="Label">Date of visit</AppText>
            <View className="flex-row gap-3">
                {/* Start Date */}
                <TouchableOpacity
                    onPress={() => onDateClick('start')}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3"
                >
                    <View className="flex-row items-center gap-2 mb-1">
                        <CalendarIcon width={14} height={14} />
                        <AppText variant="Label" className="text-xs">From</AppText>
                    </View>
                    <AppText variant="BodyBold" >{formatDate(startDate)}</AppText>
                </TouchableOpacity>

                {/* End Date */}
                <TouchableOpacity
                    onPress={() => onDateClick('end')}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3"
                >
                    <View className="flex-row items-center gap-2 mb-1">
                        <CalendarIcon width={14} height={14} />
                        <AppText variant="Label" className="text-xs">To</AppText>
                    </View>
                    <AppText variant="BodyBold" >{formatDate(endDate)}</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};


interface DiaryCalendarModalProps {
    visible: boolean;
    onClose: () => void;
    activeDateType: 'start' | 'end';
    currentMonth: Date;
    pickerYear: number;
    isYearPickerVisible: boolean;
    markedDates: any;
    // Actions
    setYearPickerVisible: (visible: boolean) => void;
    changeMonth: (increment: number) => void;
    setPickerYear: (year: number) => void;
    handleMonthSelect: (index: number) => void;
    handleDayPress: (day: DateData) => void;
    // Utils
    calculateDuration: () => string;
    toDateString: (date: Date) => string;
}

export const DiaryCalendarModal: React.FC<DiaryCalendarModalProps> = ({
    visible,
    onClose,
    activeDateType,
    currentMonth,
    pickerYear,
    isYearPickerVisible,
    markedDates,
    setYearPickerVisible,
    changeMonth,
    setPickerYear,
    handleMonthSelect,
    handleDayPress,
    calculateDuration,
    toDateString,
}) => {

    // Helpers for rendering
    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Helper to format month name
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-4">
                    <AppText variant="Heading" className="text-slate-700 mb-4 text-center">
                        {activeDateType === 'start' ? 'Select Start Date' : 'Select End Date'}
                    </AppText>

                    {/* Custom Calendar Header */}
                    <View className="flex-row items-center justify-between mb-2 px-2">
                        <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
                            <Ionicons name="chevron-back" size={24} color="#ca8a04" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setYearPickerVisible(!isYearPickerVisible)}>
                            <AppText variant="Heading" className="text-slate-800">
                                {monthName}
                            </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
                            <Ionicons name="chevron-forward" size={24} color="#ca8a04" />
                        </TouchableOpacity>
                    </View>

                    {isYearPickerVisible ? (
                        <View className="h-[350px] bg-white">
                            {/* Year Selector */}
                            <View className="flex-row items-center justify-center py-4 border-b border-slate-100 mb-2">
                                <TouchableOpacity onPress={() => setPickerYear(pickerYear - 1)} className="p-2">
                                    <Ionicons name="chevron-back" size={24} color="#ca8a04" />
                                </TouchableOpacity>
                                <AppText variant="Heading" className="text-slate-800 mx-8">{pickerYear}</AppText>
                                <TouchableOpacity onPress={() => setPickerYear(pickerYear + 1)} className="p-2">
                                    <Ionicons name="chevron-forward" size={24} color="#ca8a04" />
                                </TouchableOpacity>
                            </View>

                            {/* Month Grid */}
                            <View className="flex-row flex-wrap justify-between px-2">
                                {MONTHS.map((month, index) => (
                                    <TouchableOpacity
                                        key={month}
                                        className={`w-[30%] py-3 mb-3 rounded-xl items-center ${currentMonth.getMonth() === index && currentMonth.getFullYear() === pickerYear
                                            ? 'bg-yellow-400'
                                            : 'bg-slate-50'
                                            }`}
                                        onPress={() => handleMonthSelect(index)}
                                    >
                                        <AppText className={`font-medium ${currentMonth.getMonth() === index && currentMonth.getFullYear() === pickerYear
                                            ? 'text-white'
                                            : 'text-slate-600'
                                            }`} variant="Body" >
                                            {month.slice(0, 3)}
                                        </AppText>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <Calendar
                            key={toDateString(currentMonth)}
                            current={toDateString(currentMonth)}
                            hideArrows={true}
                            onMonthChange={(date) => {
                                // Handled externally if needed, but we control via header
                            }}
                            renderHeader={() => null} // Hide default header
                            markingType={'period'}
                            markedDates={markedDates}
                            onDayPress={handleDayPress}
                            theme={{
                                todayTextColor: '#ca8a04',
                                arrowColor: '#ca8a04',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: 'bold',
                                stylesheet: {
                                    calendar: {
                                        header: {
                                            visible: false // Ensure header is hidden
                                        }
                                    }
                                }
                            }}
                        />
                    )}
                    <Button
                        title={`Select (${calculateDuration()})`}
                        onPress={onClose}
                        variant="primary"
                        className="mt-4"
                    />
                </View>
            </View>
        </Modal>
    );
};
