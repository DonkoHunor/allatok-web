/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2'
import { allatDTO } from './allatDTO';
import { Response } from 'express';

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'allatok'
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [allatokData] = await connection.execute('SELECT nev, kor, faj FROM allatok');
    return {allatok: allatokData ,uzenet:''};
  }

  @Get('/ujAllat')
  @Render('ujAllat')
  ujAllat() {
    return{error: '', nev:'', kor: '', faj: ''};
  }

  @Post('/ujAllat')
  @Render('ujAllat')
  async ujAllatForm(@Body() ujAllat: allatDTO, @Res() res: Response) {
    const nev = ujAllat.nev;
    const kor = ujAllat.kor;
    const faj = ujAllat.faj;

    let error = '';
    if(nev.trim().length < 1) {
      error = 'Minden mező kitöltése kötelező';
      return{error: error,nev: '', kor: kor, faj: faj}
    }
    if(kor.toString().trim().length < 1) {
      error = 'Minden mező kitöltése kötelező';
      return{error: error, nev: nev, kor:'', faj: faj}
    }
    if(kor < 0) {
      error = 'Az életkor nem lehet 0-nál kisebb';
      return{error: error, nev: nev, kor:'', faj: faj}
    }
    if(faj.trim().length < 0) {
      error = 'Minden mező kitöltése kötelező';
      return{error: error, nev: nev, kor: kor, faj:''}
    }
    else {
      const [adatok] = await connection.execute('INSERT INTO allatok (nev, kor, faj) VALUES (?,?,?)',[nev, kor, faj]);
      console.log(adatok);
      res.redirect('/');
    }
    
    return{}
  }
}
