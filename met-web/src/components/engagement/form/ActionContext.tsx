import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, putEngagement, getEngagement } from '../../../services/engagementService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementParams } from './types';
import { Engagement } from '../../../models/engagement';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    handleUpdateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    saving: false,
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
    },
    engagementId: 'create',
    loadingSavedEngagement: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [saving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
    });

    useEffect(() => {
        if (engagementId !== 'create' && isNaN(Number(engagementId))) {
            navigate('/engagement/create');
        }

        if (engagementId !== 'create') {
            setLoadingSavedEngagement(true);
            getEngagement(
                Number(engagementId),
                (result: Engagement) => {
                    setSavedEngagement({ ...result });
                    setLoadingSavedEngagement(false);
                },
                (errorMessage: string) => {
                    //TODO engagement created success message in notification module
                    console.log(errorMessage);
                    navigate('/');
                },
            );
        } else {
            setLoadingSavedEngagement(false);
        }
    }, [engagementId]);

    const handleCreateEngagementRequest = (engagement: EngagementForm) => {
        setSaving(true);
        postEngagement(
            {
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
                content: engagement.content,
                rich_content: engagement.richContent,
            },
            () => {
                //TODO engagement created success message in notification module
                dispatch(
                    openNotification({ open: true, severity: 'success', text: 'Engagement Created Successfully' }),
                );
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                //TODO:engagement create error message in notification module
                dispatch(openNotification({ open: true, severity: 'error', text: 'Error Creating Engagement' }));
                setSaving(false);
                console.log(errorMessage);
            },
        );
    };

    const handleUpdateEngagementRequest = (engagement: EngagementForm) => {
        setSaving(true);
        putEngagement(
            {
                id: Number(engagementId),
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
                content: engagement.content,
                rich_content: engagement.richContent,
            },
            () => {
                //TODO engagement update success message in notification module
                dispatch(
                    openNotification({ open: true, severity: 'success', text: 'Engagement Updated Successfully' }),
                );
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                //TODO: engagement update error message in notification module
                dispatch(openNotification({ open: true, severity: 'error', text: 'Error Updating Engagement' }));
                setSaving(false);
                console.log(errorMessage);
            },
        );
    };

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                saving,
                savedEngagement,
                engagementId,
                loadingSavedEngagement,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};