import { SPFI } from "@pnp/sp";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sites";
import "@pnp/sp/sputilities";
import "@pnp/sp/webs";
import * as React from 'react';
import { getSP } from "../../pnpjsConfig";
// import styles from './TodoList.module.scss';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InputAdornment } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '100%',
            overflowX: 'auto',
        },
        table: {
            minWidth: 650,
        },
        head: {
            backgroundColor: '#3f51b5',
            color: 'white',
        },
        row: {
            '&:nth-of-type(odd)': {
                backgroundColor: '#f2f2f2',
            },
        },

        '& .MuiOutlinedInput-root': {
            backgroundColor: '#f2f2f2',
            width: 500,
            height: 5,

            '&:hover': {
                backgroundColor: '#e6e6e6',
            },
            '&.Mui-focused': {
                backgroundColor: '#f2f2f2',
            },
        }, deleteIcon: {
            color: 'red',
            '&:hover': {
                color: 'darkred',
            },
        },


    }),
);

export interface IUsers {
    key: number,
    text: string
}

export interface IData {
    Id: number,
    Title: string,
    Description: string,
    StartDate: Date,
    EndDate: Date,
    AssignedTo: string
}

function TodoList() {

    const classes = useStyles();

    const _sp: SPFI = getSP();
    const [listTask, setListTask] = React.useState<IData[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortedBy, setSortedBy] = React.useState('');
    const [sortAscending, setSortAscending] = React.useState(true);


    // Fetch users in this site
    const getUserList = async () => {
        const users = await _sp.web.siteUsers();
        const listUsersInfo: IUsers[] = [];
        if (users) {
            users.forEach((userInfo) => {
                if (userInfo.UserPrincipalName) {
                    listUsersInfo.push({ key: userInfo.Id, text: userInfo.Title })
                }
            })
        }
        return listUsersInfo

    }

    // Fetch users in this site
    const getTaskList = async () => {
        const listUserSite = await getUserList();
        const listTaskInfo: IData[] = [];
        await _sp.web.lists.getByTitle("TodoList").items.select("Id", "Title", "Description", "StartDate", "EndDate", "AssignToId")().then(item => {

            item.map(taskItem => {
                listTaskInfo.push({
                    ...taskItem, AssignedTo: listUserSite.filter(user => taskItem.AssignToId.includes(user.key)).map(item => item.text).join(",")
                });
            })
        })
        setListTask(listTaskInfo)
        return;
    }

    React.useEffect(() => {

        (async () => {
            try {
                await getTaskList();
            } catch (err) {
                console.log(err);
            }
        })();
    }, [])


    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(event.target.value);
        return;
    };

    const handleSort = (property: keyof IData): void => {
        if (sortedBy === property) {
            setSortAscending(!sortAscending);
        } else {
            setSortedBy(property);
            setSortAscending(true);
        }
        return;
    };

    const filteredData = listTask.filter((item) => {
        return (
            item.Title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            item.Description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
            item.AssignedTo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
        );
    });


    const sortedData = filteredData.sort((a: IData, b: IData) => {
        const valueA = a[sortedBy as keyof IData];
        const valueB = b[sortedBy as keyof IData];

        let comparison = 0;
        if (valueA > valueB) {
            comparison = 1;
        } else if (valueA < valueB) {
            comparison = -1;
        }



        return sortAscending ? comparison : comparison * -1;
    });

    const handleDelete = async (itemId: number) => {
        try {
            await _sp.web.lists.getByTitle("TodoList").items.getById(itemId).delete();

            const newItems = listTask.filter((item) => item.Id !== itemId);
            alert(`Delete item  ${itemId} successfully!`)
            setListTask(newItems);
        } catch (error) {
            console.log("Error deleting item: " + error);
        }
    };


    return (

        <Paper className={classes.root}>


            <TextField
                id="search"
                placeholder="Search item"
                type="search"
                margin="normal"
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.head}>No.</TableCell>

                        <TableCell className={classes.head}>
                            <TableSortLabel
                                active={sortedBy === 'title'}
                                direction={sortAscending ? 'asc' : 'desc'}
                                onClick={() => handleSort('Title')}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>

                        <TableCell className={classes.head}>
                            <TableSortLabel
                                active={sortedBy === 'Description'}
                                direction={sortAscending ? 'asc' : 'desc'}
                                onClick={() => handleSort('Description')}
                            >
                                Description
                            </TableSortLabel>
                        </TableCell>

                        <TableCell className={classes.head}>Start Date</TableCell>
                        <TableCell className={classes.head}>End Date</TableCell>

                        <TableCell className={classes.head}>
                            <TableSortLabel
                                active={sortedBy === 'AssignedTo'}
                                direction={sortAscending ? 'asc' : 'desc'}
                                onClick={() => handleSort('AssignedTo')}
                            >
                                Assigned To
                            </TableSortLabel>
                        </TableCell>

                        <TableCell className={classes.head}>Action</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((task, index) => (
                        <TableRow key={index} className={classes.row}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{task.Title}</TableCell>
                            <TableCell>{task.Description}</TableCell>
                            <TableCell>{task.StartDate}</TableCell>
                            <TableCell>{task.EndDate}</TableCell>
                            <TableCell>{task.AssignedTo}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDelete(task.Id)}>
                                    <DeleteIcon className={classes.deleteIcon} />
                                </IconButton>
                            </TableCell>

                        </TableRow>
                    ))}

                </TableBody>
            </Table>

        </Paper >
    )
}

export default TodoList