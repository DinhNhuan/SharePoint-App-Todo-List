import { SPFI } from "@pnp/sp";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sites";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import * as React from 'react';
import { getSP } from "../../pnpjsConfig";
import { useNavigate } from 'react-router-dom';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';

import {
    DatePicker, DayOfWeek
} from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

import styles from './TodoForm.module.scss';

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };


export interface IUsers {
    key: number,
    text: string
}

export interface IFormError {
    title: string,
    description: string,
    startDate: string,
    endDate: string,
    assignedTo: string
}

export interface IFormValues {
    title: string,
    description: string,
    startDate: Date | null,
    endDate: Date | null,
    assignedTo: IUsers[]
}


export interface TypedHash<T> {
    [key: string]: T;
}

export interface EmailProperties {

    To: string[];
    CC?: string[];
    BCC?: string[];
    Subject: string;
    Body: string;
    AdditionalHeaders?: TypedHash<string>;
    From?: string;
}

function TodoForm() {

    const _sp: SPFI = getSP();
    const navigate = useNavigate();
    const [firstDayOfWeek] = React.useState(DayOfWeek.Sunday);
    const [listUserSite, setListUserSite] = React.useState<IUsers[]>([]);

    const [formValues, setFormValue] = React.useState<IFormValues>({
        title: "",
        description: "",
        startDate: null,
        endDate: null,
        assignedTo: [],
    });


    const [errors, setErrors] = React.useState<IFormError>({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        assignedTo: "",
    });


    // Fetch users in this site
    const getUserList = async () => {
        const users = await _sp.web.siteUsers();
        let listUsersInfo: IUsers[] = [];
        if (users) {
            users.forEach((userInfo) => {
                if (userInfo.UserPrincipalName) {
                    listUsersInfo.push({ key: userInfo.Id, text: userInfo.Title })
                }
            })
        }
        setListUserSite(listUsersInfo);
        return;
    }

    React.useEffect(() => {
        getUserList();
    }, [])


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue({
            ...formValues,
            [event.target.name]: event.target.value
        })
    }

    const handleStartDateChange = (date: Date) => {
        setFormValue({
            ...formValues,
            "startDate": date
        })
    }

    const handleEndDateChange = (date: Date) => {
        setFormValue({
            ...formValues,
            "endDate": date
        })
    }


    const onDropdownMultiChange = async (event: React.ChangeEvent<HTMLInputElement>, item: IDropdownOption): Promise<void> => {

        if (item.selected) {
            formValues.assignedTo.push({ key: item.key as number, text: item.text as string })
        } else {
            setFormValue({
                ...formValues,
                "assignedTo": formValues.assignedTo.filter(user => user.text !== item.text)
            })

        }
    }

    const renderEmailTemplate = async () => {
        const currentUser = await _sp.web.currentUser().then(user => user.Email);

        const str_template = ` 

            <div class="">
                <table style='border: 1px solid black; border-collapse: collapse; width: 100%;' >
                    <tr>
                        <td style='border: 1px solid black;'><th style='border: 1px solid black;'> Task Name</td>
                        <td style='border: 1px solid black;'>${formValues.title}</td>
                    </tr>
                    <tr>
                        <td style='border: 1px solid black;'><th style='border: 1px solid black;'>Description</td>
                        <td style='border: 1px solid black;'>${formValues.description}</td>
                    </tr>
                    <tr>
                        <td style='border: 1px solid black;'><th style='border: 1px solid black;'>Start date</td>
                        <td style='border: 1px solid black;'>${formValues.startDate}</td>
                    </tr>
                    <tr>
                        <td style='border: 1px solid black;'><th style='border: 1px solid black;'>End date</td>
                        <td style='border: 1px solid black;'>${formValues.endDate}</td>
                    </tr>

                    <tr>
                        <td style='border: 1px solid black;'><th style='border: 1px solid black;'>Assign To</td>
                        <td style='border: 1px solid black;'>${formValues.assignedTo.map(item => item.text).join(', ')}</td>
                    </tr>
                </table>

                <p>Changes made by ${currentUser}</p>
            <div>
        `
        return str_template
    }

    const handleMailSubmit = async (str_body: string) => {
        const toMails = formValues.assignedTo.map(user => user.text.replace(/ /g, '').toLowerCase() + "@savarti.com")

        const emailProps: IEmailProperties = {
            To: toMails,
            CC: [],
            BCC: [],
            Subject: "Todo-List",
            Body: str_body,
            AdditionalHeaders: {
                "content-type": "text/html"
            }
        };
        await _sp.utility.sendEmail(emailProps);
    }

    const handleFormSubmit = async () => {
        try {

            let isFormValid = true;

            if (!formValues.title) {
                setErrors(prevErrors => ({ ...prevErrors, title: 'Title is required' }));
                isFormValid = false;
            } else {
                setErrors(prevErrors => ({ ...prevErrors, title: '' }));
            }


            if (!formValues.description) {
                setErrors(prevErrors => ({ ...prevErrors, description: 'Description is required' }));
                isFormValid = false;
            } else {
                setErrors(prevErrors => ({ ...prevErrors, description: '' }));
            }


            if (!formValues.assignedTo.length) {
                setErrors(prevErrors => ({ ...prevErrors, assignedTo: 'Assign to is required' }));
                isFormValid = false;
            } else {
                setErrors(prevErrors => ({ ...prevErrors, assignedTo: '' }));
            }


            if (!formValues.startDate) {
                setErrors(prevErrors => ({ ...prevErrors, startDate: 'Start date is required' }));
                isFormValid = false;
            } else {
                setErrors(prevErrors => ({ ...prevErrors, startDate: '' }));
            }


            if (!formValues.endDate) {
                setErrors(prevErrors => ({ ...prevErrors, endDate: 'End Date is required' }));
                isFormValid = false;
            } else {

                setErrors(prevErrors => ({ ...prevErrors, endDate: '' }));
            }


            if (!isFormValid) {
                return;
            }


            await _sp.web.lists.getByTitle("TodoList").items.add({
                Title: formValues.title,
                Description: formValues.description,
                StartDate: formValues.startDate,
                EndDate: formValues.endDate,
                AssignToId: formValues.assignedTo.map(item => item.key),

            }).then(item => {
                alert(`Form summited - Item with ID ${item.data.Id} was added to the list.`);
            })

            setFormValue({
                title: "",
                description: "",
                startDate: null,
                endDate: null,
                assignedTo: [],
            })
            navigate('/todo-list');

            renderEmailTemplate().then(body_str => {
                handleMailSubmit(body_str)
            });

        } catch (err) {
            console.error(err)
        }
    }


    return (
        <section>
            <div>

                <div className={`${styles.btnGroup}`}>
                    <PrimaryButton text="Submit request" className={`${styles.btnRequest} ${styles.btn}`} onClick={handleFormSubmit} />
                    <DefaultButton text="Cancel" className={`${styles.btnCancel} ${styles.btn}`} />
                </div>
                <table className={`${styles.table}`}>
                    <tr>
                        <td className={`${styles.label}`}>Task Name</td>
                        <td>
                            <TextField
                                name="title"
                                placeholder="Please enter text here"
                                value={formValues.title}
                                onChange={handleChange}
                                errorMessage={errors.title}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${styles.label}`}>Description</td>
                        <td>
                            <TextField
                                placeholder="Please enter description here"
                                name="description"
                                multiline rows={5}
                                value={formValues.description}
                                onChange={handleChange}
                                errorMessage={errors.description}

                            />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${styles.label}`}>Start Date</td>
                        <td>
                            <DatePicker
                                firstDayOfWeek={firstDayOfWeek}
                                showWeekNumbers={true}
                                firstWeekOfYear={1}
                                showMonthPickerAsOverlay={true}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={formValues.startDate}
                                onSelectDate={handleStartDateChange}
                                textField={{ errorMessage: errors.startDate }}


                            />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${styles.label}`}>End Date</td>
                        <td>
                            <DatePicker
                                firstDayOfWeek={firstDayOfWeek}
                                showWeekNumbers={true}
                                firstWeekOfYear={1}
                                showMonthPickerAsOverlay={true}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                value={formValues.endDate}
                                onSelectDate={handleEndDateChange}
                                textField={{ errorMessage: errors.endDate }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className={`${styles.label}`}>Assign To</td>
                        <td>
                            <Dropdown
                                placeholder="Select users"
                                multiSelect
                                options={listUserSite}
                                styles={dropdownStyles}
                                multiSelectDelimiter="; "
                                onChange={onDropdownMultiChange}
                                defaultSelectedKeys={formValues.assignedTo.map(item => item.text)}
                                errorMessage={errors.assignedTo}
                            />
                        </td>
                    </tr>
                </table>

            </div>
        </section >
    )
}

export default TodoForm