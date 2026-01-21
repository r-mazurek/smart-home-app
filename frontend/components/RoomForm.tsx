"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLanguage} from "@/context/LanguageContext";

interface RoomFormProps {
    initialValues: { name: string };
    onSubmit: (values: { name: string }) => void;
    submitLabel: string;
}

export default function RoomForm({ initialValues, onSubmit, submitLabel }: RoomFormProps) {
    const { t } = useLanguage();

    const RoomSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, `${t.minTwoCharacters}`)
            .max(20, `${t.maxTwentyCharacters}`)
            .required(t.roomNameRequired),
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Formik
                initialValues={initialValues}
                validationSchema={RoomSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onSubmit(values);
                    setSubmitting(false);
                }}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                {t.roomName}
                            </label>
                            <Field
                                type="text"
                                name="name"
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300 text-gray-700"
                                placeholder={t.roomSearchPlaceholder}
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? `${t.sending}` : submitLabel}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}