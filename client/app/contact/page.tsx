'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import BackgroundBlur from '@/components/shared/BackgroundBlur';
import PageHeader from '@/components/shared/PageHeader';

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function ContactPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        // Here you would typically send the email/message
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
    };

    return (
        <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
            {/* Dynamic Background Blurs */}
            <BackgroundBlur />

            <motion.div
                className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Contact Info */}
                <div className="flex flex-col justify-center">
                    <motion.div variants={itemVariants} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium w-fit">
                        <MessageSquare className="w-4 h-4" /> Get in Touch
                    </motion.div>

                    <PageHeader
                        className="text-left mb-6"
                        title={
                            <>
                                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#08B74F] to-emerald-400">Touch</span>
                            </>
                        }
                    />

                    <motion.div variants={itemVariants} className="text-zinc-400 text-lg mb-10 max-w-md font-medium leading-relaxed">
                        Have a question, want to collaborate, or just want to say hi? We&apos;d love to hear from you.
                        <p className="text-zinc-500 mt-2 text-sm max-w-[90%]">Send us a message and we&apos;ll respond as soon as possible.</p>
                    </motion.div>

                    <div className="space-y-6">
                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#08B74F]">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Email Us</p>
                                <p className="font-medium text-lg">foss@nitsri.ac.in</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#08B74F]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400">Visit Us</p>
                                <p className="font-medium text-lg">NIT Srinagar, Hazratbal</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
