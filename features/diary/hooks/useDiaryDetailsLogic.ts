import { useState, useCallback } from 'react';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { getDiaryDetails, getProvinceDetails, getNextVisitedProvince, DiaryDetails, ProvinceDetails } from '@/database/queries';
import { formatVisitDate } from '@/utils/dateUtils';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';

export const useDiaryDetailsLogic = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [diary, setDiary] = useState<DiaryDetails | null>(null);
    const [province, setProvince] = useState<ProvinceDetails | null>(null);
    const [nextMemory, setNextMemory] = useState<{ id: string; title: string; visitedDate: string } | null>(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const refreshDiary = useCallback(() => {
        if (id) {
            const diaryData = getDiaryDetails(id);
            const provinceData = getProvinceDetails(id);
            const nextData = getNextVisitedProvince(id);

            setDiary(diaryData);
            setProvince(provinceData);
            setNextMemory(nextData);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            refreshDiary();
        }, [refreshDiary])
    );

    const handleEdit = () => {
        router.push({
            pathname: "/diary/write",
            params: { provinceId: id as string }
        });
    };

    const handleNextMemory = () => {
        if (nextMemory) {
            router.replace(`/diary/${nextMemory.id}`);
        }
    };

    const handlePhotoPress = (index: number) => {
        if (id) {
            router.push({
                pathname: "/gallery",
                params: { provinceId: id as string, initialIndex: index.toString() }
            });
        }
    };

    const toggleShowAllPhotos = () => {
        setShowAllPhotos(prev => !prev);
    };

    // Derived data
    const displayedImages = diary && diary.images ? (showAllPhotos ? diary.images : diary.images.slice(0, 6)) : [];
    const remainingImagesCount = diary && diary.images ? Math.max(0, diary.images.length - 6) : 0;
    const formattedDate = diary ? formatVisitDate(diary.startDate, diary.endDate, 'long') : '';
    const emoji = id ? PROVINCE_EMOJIS[id] : '🇵🇭';

    return {
        id,
        diary,
        province,
        nextMemory,
        showAllPhotos,
        displayedImages,
        remainingImagesCount,
        formattedDate,
        emoji,
        handleEdit,
        handleNextMemory,
        handlePhotoPress,
        toggleShowAllPhotos,
        router
    };
};
