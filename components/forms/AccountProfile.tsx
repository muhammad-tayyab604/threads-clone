'use client'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
import { Button } from "@/components/ui/button"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '../ui/input'
import Image from 'next/image'
import { Textarea } from '../ui/textarea'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadting'
import { ClientUploadedFileData } from 'uploadthing/types'

interface props{
    user: {
        id: string,
        objectId: string,
        username: string,
        name:string,
        bio: string,
        image: string,
    },
    btnTitle: string
}


const AccountProfile = ({user, btnTitle}: props) => {

    const [files, setFiles] = useState<File[]>([])
    const {startUpload} = useUploadThing("media")

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || ""
        }
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value:string)=> void)=>{
        e.preventDefault()
        const fileReader = new FileReader()
        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0]
            setFiles(Array.from(e.target.files))
            if (!file.type.includes('image')) return
            fileReader.onloadend = async(event)=>{
                const imageDataUrl = event.target?.result?.toString() || ""

                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    const onSubmit = async (values: z.infer<typeof UserValidation>) => {
  const blob = values.profile_photo;

  const hasImageChange = isBase64Image(blob);

  if (hasImageChange) {
    const imgRes = await startUpload(files);

    if (imgRes && Array.isArray(imgRes) && imgRes.length > 0 && 'fileUrl' in imgRes[0]) {
      // Ensure fileUrl is a string before assigning
      if (typeof imgRes[0].fileUrl === 'string') {
        values.profile_photo = imgRes[0].fileUrl;
      } else {
        // Handle the case where fileUrl is not a string
        console.error('File URL is not a string:', imgRes[0].fileUrl);
      }
    } else {
      // Handle the case where imgRes is undefined or empty
      console.error('Image upload response is empty or missing fileUrl.');
    }
  }

  // Todo: update user profile
};



  return (
     <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {field.value ? (
                    <Image src={field.value} alt='Profile Photo' width={110} height={110} priority className='h-[100%] w-[100%] rounded-full object-contain' />
                ) : (
                    <Image src="/assets/profile.svg" alt='profile-photo' width={24} height={24}  className='object-contain' />
                )
            }
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input type='file' accept='image/*' placeholder='Upload Image' className='account-form_image-input' onChange={(e)=>handleImage(e, field.onChange)} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl >
                <Input type='text' placeholder='Name' className='account-form_input no-focus' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input type='text' placeholder='Username' className='account-form_input no-focus' onChange={(e)=>handleImage(e, field.onChange)} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder='Bio' className='account-form_input no-focus'/>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className='bg-primary-500'>Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile