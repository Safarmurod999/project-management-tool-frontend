import { useMemo } from 'react';
import { useParams } from 'react-router';

import { useForm } from '@mantine/form';
import {
    Button,
    Group,
    Modal,
    Select,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { createZodValidator } from '../lib';

import { useRoles } from '@/features/role/model/use-role';
import {
    createMembershipSchema,
    useMembershipCreate,
    type CreateMembershipFormData,
} from '@/features/membership';
import { useUsers } from '@/features/users/model/use-user';
import { useProfile } from '@/features/auth/model/use-profile';
import { useMemberships } from '@/features/membership/model/use-membership';

export type MembershipScopeType =
    | 'team'
    | 'project'
    | 'board';

export interface IProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    scopeType: MembershipScopeType;
}

export function MemberModal({
    open,
    setOpen,
    scopeType,
}: IProps) {
    const { id: scopeId } = useParams<{ id: string }>();

    const { data: roles, isFetched: isRolesFetched } = useRoles();
    const { data: users, isFetched: isUsersFetched } = useUsers();
    const { data: profile } = useProfile();

    const {
        data: members,
        isFetched: isMembersFetched,
    } = useMemberships({
        scopeType,
        scopeId: scopeId!,
    });

    const {
        mutate: createMembership,
        isPending,
    } = useMembershipCreate();

    const form = useForm<CreateMembershipFormData>({
        initialValues: {
            userId: '',
            scopeId: scopeId!,
            scopeType,
            roleId: '',
        },
        validate: createZodValidator(createMembershipSchema),
    });

    const existingMemberIds = useMemo(
        () =>
            new Set(
                members?.map((member) => member.userId) ?? []
            ),
        [members]
    );

    const availableUsers = useMemo(() => {
        if (!users) {
            return [];
        }

        return users.filter((user) => {
            const isCurrentUser = user.id === profile?.id;
            const isAlreadyMember = existingMemberIds.has(user.id);

            return !isCurrentUser && !isAlreadyMember;
        });
    }, [
        users,
        profile?.id,
        existingMemberIds,
    ]);

    const handleSubmit = (
        data: CreateMembershipFormData
    ) => {
        createMembership(data, {
            onSuccess: () => {
                notifications.show({
                    title: 'Muvaffaqiyatli',
                    message: "A'zo muvaffaqiyatli qo'shildi",
                    color: 'green',
                });

                form.reset();
                setOpen(false);
            },

            onError: (error: unknown) => {
                let errorMessage =
                    "A'zoni qo'shishda xatolik yuz berdi";

                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                notifications.show({
                    title: 'Xatolik',
                    message: errorMessage,
                    color: 'red',
                });
            },
        });
    };

    const userOptions = availableUsers.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            title="Yangi a'zo qo'shish"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title mb="md">
                    Yangi a'zo qo'shish
                </Title>

                <Select
                    mb="md"
                    label="Foydalanuvchi"
                    placeholder="Foydalanuvchi tanlang"
                    data={
                        isUsersFetched &&
                            isMembersFetched &&
                            userOptions.length > 0
                            ? userOptions
                            : [
                                {
                                    value: '',
                                    label: 'Foydalanuvchi topilmadi',
                                    disabled: true,
                                },
                            ]
                    }
                    {...form.getInputProps('userId')}
                    required
                />

                <Select
                    mb="md"
                    label="Role"
                    placeholder="Role tanlang"
                    data={
                        isRolesFetched && roles?.length
                            ? roles.map((role) => ({
                                value: role.id,
                                label: role.name,
                            }))
                            : [
                                {
                                    value: '',
                                    label: 'Role topilmadi',
                                    disabled: true,
                                },
                            ]
                    }
                    {...form.getInputProps('roleId')}
                    required
                />

                <Group justify="flex-end">
                    <Button
                        type="submit"
                        loading={isPending}
                    >
                        Qo'shish
                    </Button>
                </Group>
            </form>
        </Modal>
    );
}
